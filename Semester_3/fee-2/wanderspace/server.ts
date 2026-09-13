import express from "express";
import "dotenv/config";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initDatabase, pool, seedDatabase } from "./server/db";
import listingsRouter from "./server/routes/listings";
import reviewsRouter from "./server/routes/reviews";

const PORT = 3000;

async function startServer() {
    const app = express();

    // Parse incoming JSON and URL-encoded payloads
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Initialize the MySQL database
    try {
        await initDatabase();
        console.log("Database initialized successfully.");
    } catch (err) {
        console.error("Failed to initialize database:", err);
        throw err;
    }

    // Request logger
    let reqCount = 1;
    app.use((req, res, next) => {
        if (req.originalUrl.startsWith("/api")) {
            console.log(`[#${reqCount++}] ${req.method} ${req.originalUrl}`);
        }
        next();
    });

    // API Routes
    app.use("/api/listings", listingsRouter);
    app.use("/api", reviewsRouter);

    // Endpoint to restore the sample database
    app.post("/api/seed/reset", async (req, res) => {
        try {
            await seedDatabase();
            res.json({
                message: "Database reset to original sample seed data!",
            });
        } catch (err) {
            console.error("Failed to reset seed data:", err);
            res.status(500).json({ error: "Failed to reset seed data" });
        }
    });

    // Health check endpoint
    app.get("/api/health", (req, res) => {
        res.json({
            status: "ok",
            app: "WanderSpace SQL + React",
            version: "1.0.0",
        });
    });

    // Vite middleware in development vs static serving in production
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), "dist");
        app.use(express.static(distPath));
        app.get("*", (req, res) => {
            res.sendFile(path.join(distPath, "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(
            `WanderSpace server is running at http://localhost:${PORT}`,
        );
    });
}

startServer().catch(async (error) => {
    console.error("Failed to start server:", error);
    await pool.end();
    process.exit(1);
});
