import { Router, Request, Response } from "express";
import { getUser, loginUser, registerUser } from "../auth";
const router = Router();
router.post("/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || username.trim().length < 3 || typeof password !== "string" || password.length < 8)
        return res.status(400).json({ error: "Username must be at least 3 characters and password at least 8 characters." });
    try {
        const user = await registerUser(username, password);
        req.session.userId = user.id;
        res.status(201).json({ user });
    } catch (error: any) { res.status(409).json({ error: error.message || "Registration failed." }); }
});
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await loginUser(username, password);
        req.session.userId = user.id;
        res.json({ user });
    } catch {
        res.status(401).json({ error: "Invalid username or password." });
    }
});
router.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) return res.status(500).json({ error: "Logout failed." });
        res.json({ success: true });
    });
});
router.get("/me", async (req, res) => {
    const user = req.session.userId ? await getUser(req.session.userId) : null;
    res.json({ user });
});
export default router;