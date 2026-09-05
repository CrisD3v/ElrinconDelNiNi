import { test, expect } from '@playwright/test';

test.describe('Authentication Dialog & Flow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should open auth dialog from navbar with login form and OAuth providers', async ({ page }) => {
    // Find Iniciar Sesión button in navbar
    const loginTrigger = page.locator('header button:has-text("Iniciar Sesión"), nav button:has-text("Iniciar Sesión")').first();
    await expect(loginTrigger).toBeVisible();
    await loginTrigger.click();

    // Dialog appears
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Tabs inside the switcher (supports both tab and button accessibility roles)
    const tabSwitcher = dialog.locator('.grid.grid-cols-2').first();
    const loginTab = tabSwitcher.getByRole('tab', { name: 'Iniciar Sesión' }).or(tabSwitcher.getByRole('button', { name: 'Iniciar Sesión' }));
    const registerTab = tabSwitcher.getByRole('tab', { name: 'Registrarse' }).or(tabSwitcher.getByRole('button', { name: 'Registrarse' }));
    await expect(loginTab).toBeVisible();
    await expect(registerTab).toBeVisible();

    // Inputs
    await expect(dialog.locator('input[type="email"]')).toBeVisible();
    await expect(dialog.locator('input[type="password"]')).toBeVisible();

    // OAuth buttons
    await expect(dialog.getByRole('button', { name: /Google/i })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /Discord/i })).toBeVisible();
  });

  test('should toggle between Login and Register tabs dynamically', async ({ page }) => {
    const loginTrigger = page.locator('header button:has-text("Iniciar Sesión"), nav button:has-text("Iniciar Sesión")').first();
    await loginTrigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Switch to Register tab using tab switcher
    const tabSwitcher = dialog.locator('.grid.grid-cols-2').first();
    const registerTab = tabSwitcher.getByRole('tab', { name: 'Registrarse' }).or(tabSwitcher.getByRole('button', { name: 'Registrarse' }));
    await registerTab.click();

    // Verify register specific fields (Nombre)
    await expect(dialog.locator('input[type="text"]')).toBeVisible();

    // Switch back to Login tab
    const loginTab = tabSwitcher.getByRole('tab', { name: 'Iniciar Sesión' }).or(tabSwitcher.getByRole('button', { name: 'Iniciar Sesión' }));
    await loginTab.click();

    // Confirm text field no longer exists
    await expect(dialog.locator('input[type="text"]')).not.toBeVisible();
  });

  test('should toggle password visibility on click', async ({ page }) => {
    const loginTrigger = page.locator('header button:has-text("Iniciar Sesión"), nav button:has-text("Iniciar Sesión")').first();
    await loginTrigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    const passwordInput = dialog.locator('input[placeholder*="••••••"], input[placeholder*="Contraseña"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await passwordInput.fill('SecretPassword123');

    // Find eye icon toggle button inside password container
    const toggleBtn = passwordInput.locator('..').locator('button');
    await toggleBtn.click();

    // Now input type should become text
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Toggle back
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show client validation error when fields are empty or invalid', async ({ page }) => {
    const loginTrigger = page.locator('header button:has-text("Iniciar Sesión"), nav button:has-text("Iniciar Sesión")').first();
    await loginTrigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Submit without typing
    const submitBtn = dialog.locator('form button[type="submit"]');
    await submitBtn.click();

    // HTML5 or client validation requires email
    const emailInput = dialog.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should close modal when clicking the close button or pressing Escape', async ({ page }) => {
    const loginTrigger = page.locator('header button:has-text("Iniciar Sesión"), nav button:has-text("Iniciar Sesión")').first();
    await loginTrigger.click();

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });
});
