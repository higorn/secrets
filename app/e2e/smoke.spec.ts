import { test, expect } from '@playwright/test';

test.describe('PWA shell', () => {
  test('loads root and shows app', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('app-root')).toBeVisible();
  });
});
