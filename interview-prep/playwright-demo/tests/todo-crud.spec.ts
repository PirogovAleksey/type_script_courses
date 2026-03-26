import { test, expect } from './fixtures/todo.fixture';

/**
 * E2E ТЕСТИ — CRUD операції
 *
 * Питання на інтерв'ю:
 * - "Покажи приклад E2E тесту"
 * - "Як структуруєш тести?"
 *
 * Принципи:
 * 1. AAA pattern — Arrange, Act, Assert
 * 2. Кожен тест незалежний (не залежить від порядку)
 * 3. Тести читаються як документація
 */

test.describe('Todo CRUD operations', () => {
  // Використовуємо fixture todoPage — чиста сторінка
  test('should create a new todo', async ({ todoPage }) => {
    // Act
    await todoPage.addTodo('Learn Playwright');

    // Assert
    await todoPage.expectTodoCount(1);
    await todoPage.expectTodoText(['Learn Playwright']);
    await todoPage.expectRemainingCount(1);
  });

  test('should create multiple todos', async ({ todoPage }) => {
    await todoPage.addTodos(['First task', 'Second task', 'Third task']);

    await todoPage.expectTodoCount(3);
    await todoPage.expectTodoText(['First task', 'Second task', 'Third task']);
    await todoPage.expectRemainingCount(3);
  });

  // Використовуємо fixture seededTodoPage — вже є 3 todos
  test('should complete a todo', async ({ seededTodoPage }) => {
    await seededTodoPage.toggleTodo('Pay bills');

    await seededTodoPage.expectTodoCompleted('Pay bills');
    await seededTodoPage.expectTodoNotCompleted('Buy groceries');
    await seededTodoPage.expectRemainingCount(2);
  });

  test('should delete a todo', async ({ seededTodoPage }) => {
    await seededTodoPage.deleteTodo('Pay bills');

    await seededTodoPage.expectTodoCount(2);
    await seededTodoPage.expectRemainingCount(2);
  });

  test('should edit a todo', async ({ seededTodoPage }) => {
    await seededTodoPage.editTodo('Pay bills', 'Pay electricity bill');

    await seededTodoPage.expectTodoText([
      'Buy groceries',
      'Pay electricity bill',
      'Schedule meeting',
    ]);
  });
});

test.describe('Todo filtering', () => {
  test('should filter active and completed todos', async ({
    seededTodoPage,
  }) => {
    // Complete one todo
    await seededTodoPage.toggleTodo('Pay bills');

    // Filter by active
    await seededTodoPage.filterByActive();
    await seededTodoPage.expectTodoCount(2);

    // Filter by completed
    await seededTodoPage.filterByCompleted();
    await seededTodoPage.expectTodoCount(1);
    await seededTodoPage.expectTodoText(['Pay bills']);

    // Back to all
    await seededTodoPage.filterByAll();
    await seededTodoPage.expectTodoCount(3);
  });

  test('should clear completed todos', async ({ seededTodoPage }) => {
    await seededTodoPage.toggleTodo('Buy groceries');
    await seededTodoPage.toggleTodo('Pay bills');

    await seededTodoPage.clearCompletedTodos();

    await seededTodoPage.expectTodoCount(1);
    await seededTodoPage.expectTodoText(['Schedule meeting']);
  });
});
