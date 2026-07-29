import { test, expect } from '@playwright/test';

test.describe('FileKit Phase 1 Visual Assets Inspection', () => {
  test('dev visual review route renders all 18 brand assets under light and dark mode cards', async ({ page }) => {
    // Navigate to the visual review route
    await page.goto('/dev/brand-assets');

    // Verify main page title
    await expect(page.locator('h1')).toContainText('FileKit Visual Asset System');

    // Check that all 18 asset cards are rendered
    const assetCards = page.locator('h3');
    await expect(assetCards).toHaveCount(18);

    // Verify images are attached and present in DOM
    const images = page.locator('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThanOrEqual(18 * 2);

    // Verify image sources match brand assets
    const firstImgSrc = await images.first().getAttribute('src');
    expect(firstImgSrc).toContain('/brand-assets/');
  });
});
