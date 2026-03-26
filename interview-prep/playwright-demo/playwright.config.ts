import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * Типове питання: "Як ти налаштовуєш Playwright для проєкту?"
 */
export default defineConfig({
  // Де шукати тести
  testDir: './tests',

  // Паралельний запуск — прискорює виконання
  fullyParallel: true,

  // Забороняє .only в CI — захист від випадкового пушу
  forbidOnly: !!process.env.CI,

  // Retries: у CI 2 повтори (для flaky), локально — 0
  retries: process.env.CI ? 2 : 0,

  // Workers: у CI обмежуємо, локально — за замовчуванням
  workers: process.env.CI ? 1 : undefined,

  // Репортери
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Загальні налаштування для всіх тестів
  use: {
    // Base URL — не дублюємо в кожному тесті
    baseURL: 'https://demo.playwright.dev/todomvc',

    // Скріншот при падінні — для дебагу
    screenshot: 'only-on-failure',

    // Trace — записуємо тільки при retry
    trace: 'on-first-retry',

    // Таймаут для actions (click, fill, etc.)
    actionTimeout: 10_000,
  },

  // Cross-browser тестування
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile viewport
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
});
