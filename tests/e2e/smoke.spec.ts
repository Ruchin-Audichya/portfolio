import { test, expect } from "@playwright/test";

test.describe("Portfolio 3D World Smoke Test", () => {
    test("navigates to world and opens overlay", async ({ page }) => {
        // 1. Visit home
        await page.goto("/");

        // 2. Check Hero CTA
        const cta = page.getByRole("link", { name: /Explore my world/i });
        await expect(cta).toBeVisible();

        // 3. Click CTA and verify scroll
        await cta.click();
        const worldContainer = page.locator("#world");
        await expect(worldContainer).toBeVisible();

        // 4. Wait for canvas
        await expect(page.locator("canvas")).toBeVisible();

        // 5. Find Journey label (case insensitive)
        const journeyLabel = page.getByText(/journey/i);
        await expect(journeyLabel).toBeVisible({ timeout: 15000 });

        // 6. Click the label
        await journeyLabel.click();

        // 7. Verify Overlay opens
        const overlayTitle = page.getByRole("heading", { name: /My Journey/i });
        await expect(overlayTitle).toBeVisible();

        // 8. Close Overlay
        const closeBtn = page.getByLabel("Close overlay");
        await closeBtn.click();
        await expect(overlayTitle).not.toBeVisible();
    });
});
