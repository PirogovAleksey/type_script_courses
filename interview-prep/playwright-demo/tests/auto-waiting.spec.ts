import { test, expect } from '@playwright/test';

/**
 * AUTO-WAITING & ASSERTIONS
 *
 * Питання на інтерв'ю:
 * - "Як Playwright обробляє асинхронність?"
 * - "Чим Playwright кращий за Selenium/Cypress у плані очікувань?"
 *
 * Відповідь:
 * Playwright має вбудований auto-waiting:
 * 1. Actions (click, fill) — автоматично чекають поки елемент стане actionable
 *    (visible, stable, enabled, receives events)
 * 2. Assertions (expect) — автоматично retry до таймауту
 * 3. НЕ ПОТРІБНІ: sleep(), waitForTimeout(), explicit waits у 95% випадків
 */

test.describe('Auto-waiting демонстрація', () => {
  test('assertions auto-retry до таймауту', async ({ page }) => {
    await page.goto('/');

    // Додаємо todo
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Auto-wait example');
    await input.press('Enter');

    // expect автоматично retry — не потрібен sleep!
    // Якщо елемент з'являється з затримкою, Playwright сам дочекається
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li')).toHaveText('Auto-wait example');
  });

  test('web-first assertions vs raw assertions', async ({ page }) => {
    await page.goto('/');

    // ПРАВИЛЬНО — web-first assertion (auto-retry)
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();

    // НЕПРАВИЛЬНО — raw assertion (НЕ retry, може бути flaky):
    // const isVisible = await page.getByPlaceholder('...').isVisible();
    // expect(isVisible).toBe(true); // ❌ одноразова перевірка
  });

  test('explicit wait — тільки коли справді потрібен', async ({ page }) => {
    await page.goto('/');

    // Іноді потрібно чекати на network або navigation:
    // await page.waitForResponse('**/api/todos');
    // await page.waitForURL('**/dashboard');
    // await page.waitForLoadState('networkidle');

    // Але для UI елементів — завжди auto-wait через expect!
    await expect(page.locator('.todoapp')).toBeVisible();
  });
});
