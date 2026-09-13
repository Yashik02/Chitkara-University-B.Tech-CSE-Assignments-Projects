/**
 * Navbar Component
 * ------------------------------------------------------------
 * Functional component displaying WanderSpace branding, search bar,
 * wishlist counter, and "Host a Stay" action button.
 */

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Search, Heart, PlusCircle, RotateCcw } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist";

interface NavbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onResetData?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    searchQuery,
    setSearchQuery,
    onResetData,
}) => {
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // If not already on home, navigate home to show search results
        if (window.location.pathname !== "/") {
            navigate("/");
        }
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                {/* Brand Logo */}
                <Link to="/" className="brand-logo" title="WanderSpace Home">
                    <Compass className="brand-icon" />
                    <span>WanderSpace</span>
                </Link>

                {/* Global Search Bar (searches title, location, or country) */}
                <div className="navbar-search">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search stays, cities, or countries..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Navigation Actions */}
                <div className="navbar-actions">
                    {/* Wishlist Link with dynamic badge */}
                    <Link
                        to="/wishlist"
                        className="btn btn-outline"
                        title="View Saved Wishlist"
                    >
                        <Heart
                            size={18}
                            className={
                                wishlistCount > 0
                                    ? "text-red-500 fill-red-500"
                                    : ""
                            }
                        />
                        <span>Wishlist</span>
                        {wishlistCount > 0 && (
                            <span className="badge-count">{wishlistCount}</span>
                        )}
                    </Link>

                    {/* Host a Stay (+ New Listing) */}
                    <Link
                        to="/listings/new"
                        className="btn btn-brand"
                        title="List your property"
                    >
                        <PlusCircle size={18} />
                        <span>Host a Stay</span>
                    </Link>

                    {/* Reset sample data */}
                    {onResetData && (
                        <button
                            onClick={onResetData}
                            className="btn btn-outline"
                            title="Reset sample database"
                        >
                            <RotateCcw size={16} />
                            <span style={{ fontSize: "0.8rem" }}>Reset DB</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
