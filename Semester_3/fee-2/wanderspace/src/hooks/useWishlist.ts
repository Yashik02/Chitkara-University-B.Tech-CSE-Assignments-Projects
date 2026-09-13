/**
 * Custom Hook: useWishlist
 * ------------------------------------------------------------
 * Encapsulates reading and writing saved listing IDs in browser localStorage.
 */

import { useState, useEffect } from "react";

const STORAGE_KEY = "wanderspace_wishlist";

export function useWishlist() {
    // Initialize state from localStorage, or empty array if none saved
    const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Sync state changes back to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
        } catch (err) {
            console.error("Failed to save wishlist to localStorage:", err);
        }
    }, [wishlistIds]);

    // Toggle whether an item is in the wishlist
    const toggleWishlist = (id: string) => {
        setWishlistIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id); // Remove
            } else {
                return [...prev, id]; // Add
            }
        });
    };

    // Helper check: is this specific ID wishlisted?
    const isWishlisted = (id: string): boolean => {
        return wishlistIds.includes(id);
    };

    return {
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
    };
}
