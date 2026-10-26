import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";

interface AuthState {
    user: User | null;
    loading: boolean;
}

interface Credentials {
    username: string;
    password: string;
}

const initialState: AuthState = {
    user: null,
    loading: true,
};

async function getResponseData(response: Response) {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Authentication failed.");
    }
    return data;
}

export const loadCurrentUser = createAsyncThunk(
    "auth/loadCurrentUser",
    async () => {
        const response = await fetch("/api/auth/me");
        return (await getResponseData(response)).user as User | null;
    },
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials: Credentials) => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        return (await getResponseData(response)).user as User;
    },
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (credentials: Credentials) => {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        return (await getResponseData(response)).user as User;
    },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    await getResponseData(response);
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loadCurrentUser.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state) => {
                state.loading = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            });
    },
});

export default authSlice.reducer;
