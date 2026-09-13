/**
 * HomePage Component
 * ------------------------------------------------------------
 * Main landing feed displaying category filters, sorting options,
 * and dynamic grid of stay listings fetched from Express SQL backend.
 */

import React, { useState, useEffect } from "react";
import { Listing } from "../types";
import { ListingCard } from "../components/ListingCard";
import { CategoryFilter } from "../components/CategoryFilter";
import { ArrowUpDown, AlertCircle, Sparkles } from "lucide-react";

interface HomePageProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
    searchQuery,
    setSearchQuery,
}) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch listings from the Express SQL API
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
            queryParams.append("category", selectedCategory);
        }
        if (searchQuery.trim()) {
            queryParams.append("search", searchQuery.trim());
        }
        if (sortBy) {
            queryParams.append("sort", sortBy);
        }

        fetch(`/api/listings?${queryParams.toString()}`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    setListings(data.listings || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Failed to load listings:", err);
                    setError(
                        "Could not connect to database or fetch listings.",
                    );
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [selectedCategory, searchQuery, sortBy]);

    return (
        <div>
            {/* Category Pills Filter */}
            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
            />

            {/* Sub-header with Results Count & Sort Dropdown */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    gap: "1rem",
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "1.45rem",
                            fontWeight: 800,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        {selectedCategory === "All"
                            ? "Explore Stays"
                            : `${selectedCategory} Stays`}
                    </h1>
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>
                        {loading
                            ? "Finding available stays..."
                            : `Found ${listings.length} properties`}
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                </div>

                {/* Sort Controls */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <ArrowUpDown size={16} color="#666" />
                    <span
                        style={{
                            fontSize: "0.85rem",
                            color: "#555",
                            fontWeight: 600,
                        }}
                    >
                        Sort by:
                    </span>
                    <select
                        className="form-select"
                        style={{
                            width: "auto",
                            padding: "0.4rem 0.8rem",
                            fontSize: "0.88rem",
                        }}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Newest First</option>
                        <option value="rating">Highest Rated</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* Loading Skeleton / Spinner State */}
            {loading && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "4rem 1rem",
                        color: "#777",
                    }}
                >
                    <Sparkles
                        className="animate-spin"
                        size={32}
                        style={{ margin: "0 auto 1rem", color: "#fe424d" }}
                    />
                    <p>Querying SQL database...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div
                    style={{
                        background: "#fee2e2",
                        border: "1px solid #fca5a5",
                        padding: "1.25rem",
                        borderRadius: "0.85rem",
                        color: "#991b1b",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <AlertCircle size={24} />
                    <div>
                        <strong>Error:</strong> {error}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && listings.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "4rem 1rem",
                        background: "#fff",
                        borderRadius: "1.25rem",
                        border: "1px solid #eee",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "1.2rem",
                            fontWeight: 700,
                            marginBottom: "0.5rem",
                        }}
                    >
                        No stays match your criteria
                    </h3>
                    <p style={{ color: "#666", marginBottom: "1.25rem" }}>
                        Try clearing your search or switching to "All Stays".
                    </p>
                    <button
                        className="btn btn-brand"
                        onClick={() => {
                            setSearchQuery("");
                            setSelectedCategory("All");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Listings Grid */}
            {!loading && !error && listings.length > 0 && (
                <div className="listings-grid">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
};
