import { Router, Request, Response } from "express";
import passport, { registerUser } from "../auth";
const router = Router();
router.post("/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (typeof username !== "string" || username.trim().length < 3 || typeof password !== "string" || password.length < 8)
        return res.status(400).json({ error: "Username must be at least 3 characters and password at least 8 characters." });
    try {
        const user = await registerUser(username, password);
        req.login(user, (error) => error ? res.status(500).json({ error: "Failed to start session." }) : res.status(201).json({ user }));
    } catch (error: any) { res.status(409).json({ error: error.message || "Registration failed." }); }
});
router.post("/login", (req, res, next) => passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);
    if (!user) return res.status(401).json({ error: info?.message || "Invalid username or password." });
    req.logIn(user, (loginError) => loginError ? next(loginError) : res.json({ user }));
})(req, res, next));
router.post("/logout", (req, res, next) => req.logout((error) => {
    if (error) return next(error);
    req.session.destroy(() => res.json({ success: true }));
}));
router.get("/me", (req, res) => res.json({ user: req.user ?? null }));
export default router;