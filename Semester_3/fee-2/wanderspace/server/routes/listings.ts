import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { query, queryOne, run } from "../db";

const router = Router();

/**
 * GET /api/listings
 * Retrieves all listings, with optional search query, category filtering, and sorting.
 *
 * Ratings are calculated by combining listings with their reviews using SQL
 * LEFT JOIN and ROUND(AVG(reviews.rating), 1).
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const { search, category, sort } = req.query;

        let sql = `
      SELECT 
        l.id,
        l.title,
        l.description,
        l.image,
        l.price,
        l.location,
        l.country,
        l.category,
        l.created_at,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM listings l
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE 1=1
    `;

        const params: any[] = [];

        // Category filter
        if (category && category !== "All") {
            sql += ` AND l.category = ?`;
            params.push(category);
        }

        // Search filter (title, location, country, or category)
        if (search && typeof search === "string" && search.trim() !== "") {
            sql += ` AND (
        l.title LIKE ? OR 
        l.location LIKE ? OR 
        l.country LIKE ? OR 
        l.category LIKE ?
      )`;
            const pattern = `%${search.trim()}%`;
            params.push(pattern, pattern, pattern, pattern);
        }

        sql += ` GROUP BY l.id`;

        // Sorting
        if (sort === "price_asc") {
            sql += ` ORDER BY l.price ASC`;
        } else if (sort === "price_desc") {
            sql += ` ORDER BY l.price DESC`;
        } else if (sort === "rating") {
            sql += ` ORDER BY avg_rating DESC NULLS LAST, l.id DESC`;
        } else {
            // Default newest
            sql += ` ORDER BY l.id DESC`;
        }

        const listings = await query(sql, params);
        res.json({ listings });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({
            error: "Failed to retrieve listings from database.",
        });
    }
});

/**
 * GET /api/listings/:id
 * Retrieves a single listing and all its associated reviews
 */
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // 1. Fetch listing with rating summary
        const listingSql = `
      SELECT 
        l.*,
        ROUND(AVG(r.rating), 1) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM listings l
      LEFT JOIN reviews r ON l.id = r.listing_id
      WHERE l.id = ?
      GROUP BY l.id
    `;
        const listing = await queryOne(listingSql, [id]);

        if (!listing) {
            return res.status(404).json({ error: "Listing not found" });
        }

        // 2. Fetch all individual reviews for this listing
        const reviewsSql = `
      SELECT * FROM reviews 
      WHERE listing_id = ? 
      ORDER BY id DESC
    `;
        const reviews = await query(reviewsSql, [id]);

        res.json({ listing, reviews });
    } catch (error) {
        console.error("Error fetching listing details:", error);
        res.status(500).json({ error: "Failed to fetch listing details." });
    }
});

/**
 * POST /api/listings
 * Creates a new stay listing in the SQL database
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            image,
            price,
            location,
            country,
            category,
        } = req.body;

        // Basic server-side validation
        if (!title || !price || !location || !country) {
            return res.status(400).json({
                error: "Title, price, location, and country are required.",
            });
        }

        const defaultImage =
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
        const finalImage =
            image && image.trim() !== "" ? image.trim() : defaultImage;
        const finalCategory =
            category && category.trim() !== "" ? category.trim() : "Trending";

        const id = randomUUID();
        const insertSql = `
            INSERT INTO listings (id, title, description, image, price, location, country, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        await run(insertSql, [
            id,
            title.trim(),
            description ? description.trim() : "",
            finalImage,
            Number(price),
            location.trim(),
            country.trim(),
            finalCategory,
        ]);

        const newListing = await queryOne(
            "SELECT * FROM listings WHERE id = ?",
            [id],
        );
        res.status(201).json({
            listing: newListing,
            message: "Listing created successfully!",
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({
            error: "Failed to create listing in database.",
        });
    }
});

/**
 * PUT /api/listings/:id
 * Updates an existing stay listing
 */
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const {
            title,
            description,
            image,
            price,
            location,
            country,
            category,
        } = req.body;

        if (!title || !price || !location || !country) {
            return res.status(400).json({
                error: "Title, price, location, and country are required.",
            });
        }

        const updateSql = `
      UPDATE listings 
      SET title = ?, description = ?, image = ?, price = ?, location = ?, country = ?, category = ?
      WHERE id = ?
    `;

        const result = await run(updateSql, [
            title.trim(),
            description ? description.trim() : "",
            image ? image.trim() : "",
            Number(price),
            location.trim(),
            country.trim(),
            category ? category.trim() : "Trending",
            id,
        ]);

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ error: "Listing not found to update." });
        }

        const updated = await queryOne("SELECT * FROM listings WHERE id = ?", [
            id,
        ]);
        res.json({
            listing: updated,
            message: "Listing updated successfully!",
        });
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({ error: "Failed to update listing." });
    }
});

/**
 * DELETE /api/listings/:id
 * Deletes a listing and automatically cascades to delete all reviews
 */
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await run("DELETE FROM listings WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Listing not found." });
        }

        res.json({
            success: true,
            message: "Listing and related reviews deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({ error: "Failed to delete listing." });
    }
});

export default router;
