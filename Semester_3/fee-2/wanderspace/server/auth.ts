import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { queryOne, run } from "./db";

export interface AuthUser { id: string; username: string; }
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await queryOne<any>("SELECT id, username, password_hash FROM users WHERE username = ?", [username.trim()]);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) return done(null, false, { message: "Invalid username or password." });
        return done(null, { id: user.id, username: user.username });
    } catch (error) { return done(error); }
}));
passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: string, done) => {
    try { done(null, await queryOne<any>("SELECT id, username FROM users WHERE id = ?", [id])); }
    catch (error) { done(error); }
});
export async function registerUser(username: string, password: string): Promise<AuthUser> {
    const normalized = username.trim();
    if (await queryOne("SELECT id FROM users WHERE username = ?", [normalized])) throw new Error("Username is already taken.");
    const user = { id: randomUUID(), username: normalized };
    await run("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)", [user.id, user.username, await bcrypt.hash(password, 12)]);
    return user;
}
export default passport;