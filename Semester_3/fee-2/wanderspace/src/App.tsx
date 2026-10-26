import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ListingDetailPage } from "./pages/ListingDetailPage";
import { NewListingPage } from "./pages/NewListingPage";
import { EditListingPage } from "./pages/EditListingPage";
import { WishlistPage } from "./pages/WishlistPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthPage } from "./pages/AuthPage";
import { RequireAuth } from "./hooks/useAuth";
import { useNotifications } from "./hooks/useNotifications";
import { useLanguage } from "./hooks/useLanguage";
import { useAppDispatch } from "./app/hooks";
import { loadCurrentUser } from "./features/auth/authSlice";

export default function App() {
    const { notify } = useNotifications();
    const { t } = useLanguage();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadCurrentUser());
    }, [dispatch]);

    const handleResetData = async () => {
        if (!window.confirm(t("resetConfirm"))) {
            return;
        }

        try {
            const res = await fetch("/api/seed/reset", { method: "POST" });
            if (res.ok) {
                notify(t("databaseReset"), "success");
                window.location.href = "/";
                return;
            }

            notify(t("resetFailed"), "error");
        } catch (error) {
            console.error(error);
            notify(t("resetFailed"), "error");
        }
    };

    return (
        <div className="app-container">
            <Navbar onResetData={handleResetData} />

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route
                        path="/listings/new"
                        element={
                            <RequireAuth>
                                <NewListingPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/listings/:id"
                        element={<ListingDetailPage />}
                    />
                    <Route
                        path="/listings/:id/edit"
                        element={
                            <RequireAuth>
                                <EditListingPage />
                            </RequireAuth>
                        }
                    />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}
