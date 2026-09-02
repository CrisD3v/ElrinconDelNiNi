import { test, expect } from '@playwright/test';

test.describe('Home Page E2E', () => {
  test('should load the home page and display the hero section', async ({ page }) => {
    // Navigate to the root (which redirects to /es or the default locale)
    await page.goto('/');

    // Wait for the hydration and the hero section to be visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Check if the navbar is present
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Verify there are buttons in the hero (e.g. Leer ahora, Explorar)
    // We look for elements with role 'button' inside the first section
    const buttons = heroSection.locator('button, a[role="button"], a.inline-flex');
    await expect(buttons.first()).toBeVisible();
  });
});
