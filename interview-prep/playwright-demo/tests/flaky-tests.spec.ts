import { test, expect } from '@playwright/test';

/**
 * FLAKY TESTS — як боротися
 *
 * Питання на інтерв'ю:
 * - "Як ти борешся з flaky тестами?"
 * - "Що робиш коли тест проходить 9 з 10 разів?"
 *
 * Відповідь (стратегія):
 *
 * 1. ВИЯВЛЕННЯ:
 *    - `npx playwright test --repeat-each=10` — прогнати тест 10 разів
 *    - CI retries — якщо тест проходить тільки з retry, він flaky
 *    - Playwright trace — записуємо trace для аналізу
 *
 * 2. ПРИЧИНИ (від найчастіших):
 *    a) Race conditions — елемент не готовий
 *       Рішення: використовуй web-first assertions (expect з auto-retry)
 *
 *    b) Тест залежить від іншого тесту
 *       Рішення: кожен тест — незалежний, власний setup
 *
 *    c) Анімації/transitions
 *       Рішення: відключити анімації або чекати стабільності
 *
 *    d) Мережа/таймінги
 *       Рішення: мокати API, waitForResponse
 *
 *    e) Дата/час залежність
 *       Рішення: мокати clock
 *
 * 3. ЗАПОБІГАННЯ:
 *    - Ніколи не використовуй hardcoded waits (sleep)
 *    - Завжди використовуй web-first assertions
 *    - Ізолюй тести одне від одного
 *    - Мокай зовнішні залежності
 */

test.describe('Прийоми боротьби з flaky тестами', () => {
  test('ПОГАНО: hardcoded wait', async ({ page }) => {
    await page.goto('/');

    // ❌ НІКОЛИ так не роби:
    // await page.waitForTimeout(2000);
    // const text = await page.locator('.todo-count').textContent();
    // expect(text).toContain('0 items');

    // ✅ ПРАВИЛЬНО: web-first assertion
    await expect(page.locator('.todoapp')).toBeVisible();
  });

  test('мокаємо час для time-dependent логіки', async ({ page }) => {
    // Фіксуємо час — тест більше не залежить від реального часу
    await page.clock.setFixedTime(new Date('2025-01-15T10:00:00'));

    await page.goto('/');

    // Тепер Date.now() завжди повертає 2025-01-15T10:00:00
    // Корисно для тестування: дедлайнів, таймерів, scheduled payments
  });

  test('перехоплюємо мережу для стабільності', async ({ page }) => {
    // Замість очікування реального API — мокаємо
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ data: 'mocked' }),
      });
    });

    await page.goto('/');
    // Тест не залежить від швидкості мережі чи доступності API
  });
});

/**
 * ДОДАТКОВІ ІНСТРУМЕНТИ для дебагу:
 *
 * 1. Playwright Inspector:
 *    npx playwright test --debug
 *
 * 2. Trace Viewer:
 *    npx playwright show-trace trace.zip
 *
 * 3. UI Mode (інтерактивний запуск):
 *    npx playwright test --ui
 *
 * 4. Headed mode (бачиш браузер):
 *    npx playwright test --headed
 *
 * 5. Codegen (генерація тестів):
 *    npx playwright codegen https://example.com
 */
