import { render, screen } from "@testing-library/react";
import { Hero } from "../Hero";
import "@testing-library/jest-dom";

describe("Hero Component", () => {
    it("renders the main headline", () => {
        render(<Hero />);
        expect(screen.getByText(/Ruchin Audichya/i)).toBeInTheDocument();
        expect(screen.getByText(/Building in Cloud, Business/i)).toBeInTheDocument();
    });

    it("renders the CTA button with correct link", () => {
        render(<Hero />);
        const link = screen.getByRole("link", { name: /Explore my world/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "#world");
    });
});
