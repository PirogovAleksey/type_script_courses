import { test, expect } from '@playwright/test';

/**
 * FINTECH-СПЕЦИФІЧНІ СЦЕНАРІЇ
 *
 * Питання на інтерв'ю:
 * - "Що специфічного в тестуванні фінтех-додатків?"
 * - "Які edge cases для платіжних систем?"
 *
 * Ключові моменти для Payset:
 * 1. Точність грошових операцій (floating point!)
 * 2. Валютний обмін — курси, комісії
 * 3. Безпека — авторизація, XSS, CSRF
 * 4. Compliance — KYC/AML потоки
 * 5. Concurrency — подвійні транзакції
 */

test.describe('Currency Exchange — мокані сценарії', () => {
  test('should display correct exchange rate', async ({ page }) => {
    // Мокаємо API курсів валют
    await page.route('**/api/exchange-rates*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          base: 'USD',
          rates: { EUR: 0.92, GBP: 0.79, UAH: 41.50 },
          timestamp: Date.now(),
        }),
      });
    });

    // У реальному тесті:
    // await page.goto('/exchange');
    // await page.getByLabel('Amount').fill('1000');
    // await page.getByLabel('From').selectOption('USD');
    // await page.getByLabel('To').selectOption('EUR');
    // await expect(page.getByTestId('converted-amount')).toHaveText('920.00');
  });

  test('should handle precision correctly', async ({ page }) => {
    /**
     * КРИТИЧНО для фінтеху:
     * 0.1 + 0.2 !== 0.3 у JavaScript!
     *
     * Тестуємо що:
     * - Суми відображаються з правильною кількістю десяткових знаків
     * - Округлення працює коректно
     * - Комісія обраховується точно
     *
     * Приклад: переказ 1000.10 USD з комісією 0.5%
     * Комісія: 5.00 (не 5.0005!)
     * До отримання: 995.10
     */

    await page.route('**/api/transfer/calculate', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          amount: 1000.10,
          fee: 5.00,
          total: 995.10,
          currency: 'USD',
        }),
      });
    });

    // await page.goto('/transfer');
    // await page.getByLabel('Amount').fill('1000.10');
    // await expect(page.getByTestId('fee')).toHaveText('$5.00');
    // await expect(page.getByTestId('total')).toHaveText('$995.10');
  });

  test('should prevent double submission', async ({ page }) => {
    /**
     * Подвійна відправка — класичний фінтех баг.
     * Кнопка "Send" повинна бути disabled після першого кліку.
     */

    let requestCount = 0;
    await page.route('**/api/transfer', (route) => {
      requestCount++;
      // Затримка щоб симулювати реальний API
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true }),
        });
      }, 1000);
    });

    // await page.goto('/transfer');
    // await page.getByRole('button', { name: 'Send' }).click();
    // await page.getByRole('button', { name: 'Send' }).click(); // спроба подвійного кліку
    // expect(requestCount).toBe(1); // Тільки один запит!
  });
});

test.describe('Security edge cases', () => {
  test('should sanitize user input (XSS prevention)', async ({ page }) => {
    await page.goto('/');

    // Пробуємо XSS через input
    const maliciousInput = '<script>alert("xss")</script>';
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill(maliciousInput);
    await input.press('Enter');

    // Текст повинен відображатися як текст, не як HTML
    await expect(page.locator('.todo-list li')).toHaveText(maliciousInput);

    // Перевіряємо що script НЕ виконався
    // (якщо б виконався, page.evaluate поверне true)
    const alertFired = await page.evaluate(() => {
      return (window as any).__xss_fired === true;
    });
    expect(alertFired).toBeFalsy();
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    // Симулюємо протухлу сесію
    await page.route('**/api/**', (route) => {
      route.fulfill({
        status: 401,
        body: JSON.stringify({ error: 'Session expired' }),
      });
    });

    // UI повинен перенаправити на login
    // await page.goto('/dashboard');
    // await expect(page).toHaveURL(/.*login/);
    // await expect(page.getByText('Session expired')).toBeVisible();
  });
});
