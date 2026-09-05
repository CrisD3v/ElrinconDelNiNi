import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {
  test('should load the home page and display navigation and content', async ({ page }) => {
    // Navigate to the root (which redirects to /es)
    await page.goto('/es');

    // Check if the navbar is present and visible
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Verify brand logo link
    await expect(page.locator('nav a:has-text("El Rincón del NiNi")')).toBeVisible();

    // Wait for the hydration and the hero section or main sections to be visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });
});
