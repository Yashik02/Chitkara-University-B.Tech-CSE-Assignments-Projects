/**
 * WanderSpace - Main Application Component
 * ------------------------------------------------------------
 * 3rd Semester React + SQL Architecture:
 * - Dynamic client-side routing via React Router (Routes, Route, useParams, useNavigate)
 * - Functional components with JSX
 * - Controlled forms and local state management (useState)
 * - Side-effect handling (useEffect)
 * - DOM manipulation & focus control (useRef)
 * - Custom Hook for browser storage (useWishlist with localStorage)
 * - NO Redux or Context API: clean, direct, modular props flow.
 */

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { NewListingPage } from "./pages/NewListingPage";
import { EditListingPage } from "./pages/EditListingPage";
import { WishlistPage } from "./pages/WishlistPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Restore the database to its initial sample state
    const handleResetData = async () => {
        if (
            !window.confirm(
                "Reset the database back to its sample listings and reviews?",
            )
        ) {
            return;
        }

        try {
            const res = await fetch("/api/seed/reset", { method: "POST" });
            if (res.ok) {
                alert("Database reset successfully! Reloading...");
                window.location.href = "/";
            }
        } catch (err) {
            console.error(err);
            alert("Failed to reset database.");
        }
    };

    return (
        <div className="app-container">
            {/* Handcrafted Navbar */}
            <Navbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onResetData={handleResetData}
            />

            {/* Main Content Area with Dynamic Route Views */}
            <main className="main-content">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <HomePage
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        }
                    />
                    <Route path="/listings/new" element={<NewListingPage />} />
                    <Route
                        path="/listings/:id"
                        element={<ListingDetailPage />}
                    />
                    <Route
                        path="/listings/:id/edit"
                        element={<EditListingPage />}
                    />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            {/* Warm Brand Footer */}
            <Footer />
        </div>
    );
}
