import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export interface AuthUser {
    id: string;
    username: string;
}

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function authEmail(username: string): string {
    return `${username.trim().toLowerCase()}@users.wanderspace.local`;
}

export async function registerUser(username: string, password: string): Promise<AuthUser> {
    const normalized = username.trim();
    const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", normalized)
        .maybeSingle();
    if (existing) throw new Error("Username is already taken.");

    const { data, error } = await supabase.auth.admin.createUser({
        email: authEmail(normalized),
        password,
        email_confirm: true,
        user_metadata: { username: normalized },
    });
    if (error || !data.user) throw error ?? new Error("Registration failed.");

    const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, username: normalized });
    if (profileError) {
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
    }
    return { id: data.user.id, username: normalized };
}

export async function loginUser(username: string, password: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail(username),
        password,
    });
    if (error || !data.user) throw new Error("Invalid username or password.");
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();
    if (profileError) throw profileError;
    return { id: data.user.id, username: profile.username };
}

export async function getUser(id: string): Promise<AuthUser | null> {
    const { data } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", id)
        .maybeSingle();
    return data;
}