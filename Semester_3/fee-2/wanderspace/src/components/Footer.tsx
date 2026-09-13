/**
 * Footer Component
 * ------------------------------------------------------------
 * Handcrafted footer preserving WanderSpace branding and student project links.
 */

import React from "react";
import { Compass, Heart } from "lucide-react";

export const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: "#fe424d",
                        fontWeight: 700,
                    }}
                >
                    <Compass size={20} />
                    <span>WanderSpace</span>
                </div>

                <p
                    style={{
                        color: "#666",
                        fontSize: "0.9rem",
                        maxWidth: "500px",
                    }}
                >
                    A full-stack student project built with React, Express, and
                    Relational SQL. Designed with love for clean architecture
                    and human-crafted design.
                </p>

                <div className="footer-links">
                    <a href="#privacy" className="footer-link">
                        Privacy Policy
                    </a>
                    <a href="#terms" className="footer-link">
                        Terms of Service
                    </a>
                    <a href="#destinations" className="footer-link">
                        Destinations
                    </a>
                </div>

                <div className="footer-copy">
                    © {new Date().getFullYear()} WanderSpace, Inc. All rights
                    reserved.
                </div>
            </div>
        </footer>
    );
};
