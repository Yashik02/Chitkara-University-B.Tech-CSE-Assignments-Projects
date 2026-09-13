/**
 * WishlistPage Component
 * ------------------------------------------------------------
 * Displays properties that the user has saved locally in browser storage.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { Listing } from "../types";
import { useWishlist } from "../hooks/useWishlist";
import { ListingCard } from "../components/ListingCard";

export const WishlistPage: React.FC = () => {
    const { wishlistIds } = useWishlist();
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch("/api/listings")
            .then((res) => res.json())
            .then((data) => {
                setAllListings(data.listings || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Filter listings by the saved IDs in localStorage
    const savedListings = allListings.filter((item) =>
        wishlistIds.includes(item.id),
    );

    return (
        <div>
            <Link
                to="/"
                className="btn btn-outline"
                style={{ border: "none", paddingLeft: 0, marginBottom: "1rem" }}
            >
                <ArrowLeft size={18} />
                <span>Back to All Stays</span>
            </Link>

            <div style={{ marginBottom: "2rem" }}>
                <h1
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <Heart size={26} className="text-red-500 fill-red-500" />
                    <span>Your Saved Wishlist</span>
                </h1>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>
                    {wishlistIds.length === 0
                        ? "No stays saved yet. Click the heart on any property to save it!"
                        : `You have saved ${savedListings.length} ${savedListings.length === 1 ? "property" : "properties"} for your next trip.`}
                </p>
            </div>

            {loading ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "#666",
                    }}
                >
                    Loading saved stays...
                </div>
            ) : savedListings.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "4rem 1.5rem",
                        background: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "1.25rem",
                    }}
                >
                    <Heart
                        size={48}
                        color="#fe424d"
                        style={{ margin: "0 auto 1rem", opacity: 0.5 }}
                    />
                    <h3
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Your wishlist is empty
                    </h3>
                    <p
                        style={{
                            color: "#666",
                            marginBottom: "1.5rem",
                            maxWidth: "400px",
                            margin: "0 auto 1.5rem",
                        }}
                    >
                        As you search, tap the heart icon on any stay to save
                        your favorite places to stay and compare.
                    </p>
                    <Link to="/" className="btn btn-brand">
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <div className="listings-grid">
                    {savedListings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
};
