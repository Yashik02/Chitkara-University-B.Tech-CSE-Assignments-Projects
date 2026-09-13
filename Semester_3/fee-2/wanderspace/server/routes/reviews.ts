import { Router, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { queryOne, run } from "../db";

const router = Router({ mergeParams: true });

/**
 * POST /api/listings/:id/reviews
 * Creates a review for a specific listing and saves to SQL database
 */
router.post("/listings/:id/reviews", async (req: Request, res: Response) => {
    try {
        const listingId = req.params.id;
        const { author, rating, comment } = req.body;

        if (!rating || !comment || comment.trim() === "") {
            return res
                .status(400)
                .json({ error: "Rating and comment are required." });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res
                .status(400)
                .json({ error: "Rating must be an integer between 1 and 5." });
        }

        // Check if listing exists
        const listing = await queryOne("SELECT id FROM listings WHERE id = ?", [
            listingId,
        ]);
        if (!listing) {
            return res.status(404).json({ error: "Listing does not exist." });
        }

        const finalAuthor =
            author && author.trim() !== "" ? author.trim() : "Anonymous Guest";

        const reviewId = randomUUID();
        const insertSql = `
      INSERT INTO reviews (id, listing_id, author, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;

        await run(insertSql, [
            reviewId,
            listingId,
            finalAuthor,
            numericRating,
            comment.trim(),
        ]);
        const newReview = await queryOne("SELECT * FROM reviews WHERE id = ?", [
            reviewId,
        ]);

        res.status(201).json({
            review: newReview,
            message: "Review added successfully!",
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Failed to add review." });
    }
});

/**
 * DELETE /api/reviews/:id
 * Deletes a single review by ID
 */
router.delete("/reviews/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await run("DELETE FROM reviews WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Review not found." });
        }

        res.json({ success: true, message: "Review deleted successfully." });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Failed to delete review." });
    }
});

export default router;
