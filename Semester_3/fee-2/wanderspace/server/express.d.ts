import { AuthUser } from "./auth";
import "express-session";
declare global {
    namespace Express {
        interface User extends AuthUser {}
    }
}
declare module "express-session" {
    interface SessionData {
        userId?: string;
    }
}
declare global {
    namespace Express {
        interface Request {
            user?: User;
            isAuthenticated(): boolean;
        }
    }
}