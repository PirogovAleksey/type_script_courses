import { test, expect } from '@playwright/test';

/**
 * API TESTING в Playwright
 *
 * Питання на інтерв'ю:
 * - "Як тестуєш API у Playwright?"
 * - "Навіщо мокати API у E2E тестах?"
 *
 * Відповідь:
 * Playwright може тестувати API напряму (без браузера)
 * і мокати/перехоплювати мережеві запити.
 *
 * Два підходи:
 * 1. API testing — тестування REST API напряму
 * 2. Route mocking — підміна відповідей для UI тестів
 */

// --- 1. API Testing (без браузера) ---
test.describe('API Testing', () => {
  test('GET request', async ({ request }) => {
    // request — вбудований fixture для API тестів
    const response = await request.get('https://jsonplaceholder.typicode.com/todos/1');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('id', 1);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('completed');
  });

  test('POST request', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/todos', {
      data: {
        title: 'New todo from Playwright',
        completed: false,
        userId: 1,
      },
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe('New todo from Playwright');
  });

  test('response headers and timing', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/todos');

    // Перевірка headers
    expect(response.headers()['content-type']).toContain('application/json');

    // Перевірка що відповідь — масив
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });
});

// --- 2. Route Mocking (перехоплення запитів) ---
test.describe('Route Mocking', () => {
  /**
   * Навіщо мокати?
   * 1. Тестувати UI незалежно від backend
   * 2. Тестувати edge cases (помилки, порожні відповіді)
   * 3. Швидкість — не чекаємо реальний API
   *
   * Для фінтеху:
   * - Мокаємо платіжні відповіді (success, declined, timeout)
   * - Мокаємо курси валют
   * - Тестуємо помилкові сценарії без ризику
   */
  test('mock API response', async ({ page }) => {
    // Перехоплюємо запити до API
    await page.route('**/api/transactions', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, amount: 100.50, currency: 'USD', status: 'completed' },
          { id: 2, amount: 250.00, currency: 'EUR', status: 'pending' },
        ]),
      });
    });

    // Тепер будь-яка навігація отримає мокнуті дані
    // await page.goto('/transactions');
    // await expect(page.getByText('$100.50')).toBeVisible();
  });

  test('simulate API error', async ({ page }) => {
    // Тестуємо як UI обробляє помилки
    await page.route('**/api/transactions', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    // UI повинен показати error message
    // await page.goto('/transactions');
    // await expect(page.getByText('Something went wrong')).toBeVisible();
  });

  test('simulate network failure', async ({ page }) => {
    // Тестуємо відсутність мережі
    await page.route('**/api/**', (route) => {
      route.abort('connectionrefused');
    });

    // UI повинен показати offline state
    // await page.goto('/dashboard');
    // await expect(page.getByText('No connection')).toBeVisible();
  });
});
