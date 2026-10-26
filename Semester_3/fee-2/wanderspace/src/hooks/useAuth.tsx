import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types";
import { useNotifications } from "./useNotifications";
import { useLanguage } from "./useLanguage";
interface AuthContextValue {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { notify } = useNotifications();
    const { t } = useLanguage();
    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((d) => setUser(d.user))
            .finally(() => setLoading(false));
    }, []);
    const action = async (url: string, body?: object) => {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body || {}),
        });
        const d = await r.json();
        if (!r.ok) {
            const message = d.error || t("authFailed");
            notify(message, "error");
            throw new Error(message);
        }
        setUser(d.user);
        notify(
            url.includes("/register")
                ? t("register")
                : t("loggedIn"),
            "success",
        );
    };
    const login = (username: string, password: string) =>
        action("/api/auth/login", { username, password });
    const register = (username: string, password: string) =>
        action("/api/auth/register", { username, password });
    const logout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            if (!response.ok) throw new Error("Logout failed.");
            setUser(null);
            notify(t("loggedOut"), "success");
        } catch (error) {
            notify(
                error instanceof Error ? error.message : "Logout failed.",
                "error",
            );
        }
    };
    return (
        <AuthContext.Provider
            value={{ user, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) throw new Error("useAuth must be used within AuthProvider");
    return value;
};
export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!loading && !user) navigate("/auth?mode=login", { replace: true });
    }, [loading, user, navigate]);
    return loading || !user ? null : <>{children}</>;
};
