import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListingsState {
    searchQuery: string;
}

const listingsSlice = createSlice({
    name: "listings",
    initialState: { searchQuery: "" } satisfies ListingsState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        clearSearch(state) {
            state.searchQuery = "";
        },
    },
});

export const { setSearchQuery, clearSearch } = listingsSlice.actions;
export default listingsSlice.reducer;
