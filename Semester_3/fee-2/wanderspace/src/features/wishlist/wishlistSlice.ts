import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
    ids: string[];
}

const STORAGE_KEY = "wanderspace_wishlist";

function readStoredIds(): string[] {
    try {
        const value = sessionStorage.getItem(STORAGE_KEY);
        const parsed: unknown = value ? JSON.parse(value) : [];
        return Array.isArray(parsed)
            ? Array.from(new Set(parsed.filter((id): id is string => typeof id === "string")))
            : [];
    } catch (error) {
        console.error("Failed to read wishlist:", error);
        return [];
    }
}

function saveIds(ids: string[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: { ids: readStoredIds() } satisfies WishlistState,
    reducers: {
        toggleWishlist(state, action: PayloadAction<string>) {
            const id = action.payload;
            state.ids = state.ids.includes(id)
                ? state.ids.filter((item) => item !== id)
                : [...state.ids, id];
            saveIds(state.ids);
        },
        reconcileWishlist(state, action: PayloadAction<string[]>) {
            state.ids = state.ids.filter((id) => action.payload.includes(id));
            saveIds(state.ids);
        },
    },
});

export const { toggleWishlist, reconcileWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
