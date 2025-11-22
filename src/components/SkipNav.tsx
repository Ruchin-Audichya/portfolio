import React from "react";

/**
 * Skip navigation link for keyboard users.
 * It becomes visible when focused and allows jumping directly to the main content.
 */
export const SkipNav = () => (
    <a
        href="#main-content"
        className="skip-nav absolute left-0 top-0 bg-white text-black p-2 m-2 rounded shadow-lg focus-visible:translate-y-0 transform -translate-y-12 transition-transform duration-200"
    >
        Skip to main content
    </a>
);
