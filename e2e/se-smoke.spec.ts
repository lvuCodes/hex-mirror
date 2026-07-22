import { expect, test } from "@playwright/test";
import { defineSeSmoke, SE_VIEWPORT } from "@lvucodes/ui/se-smoke";

// The site builds with base "/hex-mirror/", so `vite preview` serves it there.
const PATH = "/hex-mirror/";

// The shared iPhone SE base suite: no horizontal overflow, back link anchored at
// 20/20, and the primary controls (a.pill) unclipped.
defineSeSmoke({ path: PATH, expectBackLink: true });

// Site-specific assertions layered on top of the shared base.
test.describe("Hex Mirror layout", () => {
  test.use({ viewport: SE_VIEWPORT });

  test("the hex input and mirror boxes are visible and unclipped", async ({ page }) => {
    await page.goto(PATH);

    const input = page.locator("#hex-input");
    await expect(input).toBeVisible();

    const card = page.locator(".display-card");
    await expect(card).toBeVisible();

    const table = page.locator(".color-box");
    await expect(table).toBeVisible();

    for (const [name, locator] of [
      ["display-card", card],
      ["color-box", table],
    ] as const) {
      const box = await locator.boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.x, `${name} left edge`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `${name} right edge`).toBeLessThanOrEqual(SE_VIEWPORT.width);
    }
  });
});
