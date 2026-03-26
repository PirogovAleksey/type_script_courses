import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo.page';

/**
 * CUSTOM FIXTURES
 *
 * Питання на інтерв'ю:
 * - "Що таке fixtures у Playwright?"
 * - "Чим відрізняються від beforeEach?"
 *
 * Відповідь:
 * Fixtures — це спосіб надавати тестам залежності (DI pattern).
 * Переваги над beforeEach:
 * 1. Lazy — створюються тільки якщо тест їх використовує
 * 2. Composable — можна комбінувати
 * 3. Encapsulated — setup + teardown в одному місці
 * 4. Reusable — між різними test files
 */

// Визначаємо типи наших fixtures
type TodoFixtures = {
  todoPage: TodoPage;
  seededTodoPage: TodoPage;
};

// Розширюємо базовий test
export const test = base.extend<TodoFixtures>({
  // Fixture: порожня TodoPage
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    // use() — тест виконується тут
    await use(todoPage);
    // Після use() — cleanup (якщо потрібен)
  },

  // Fixture: TodoPage з попередньо створеними todos
  seededTodoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await todoPage.addTodos([
      'Buy groceries',
      'Pay bills',
      'Schedule meeting',
    ]);
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
