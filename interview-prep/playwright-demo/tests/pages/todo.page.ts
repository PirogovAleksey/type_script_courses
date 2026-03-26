import { type Locator, type Page, expect } from '@playwright/test';

/**
 * PAGE OBJECT MODEL (POM)
 *
 * Питання на інтерв'ю:
 * - "Що таке Page Object і навіщо він потрібен?"
 * - "Як ти організовуєш тести?"
 *
 * Відповідь:
 * POM — патерн, що інкапсулює UI-взаємодію в класи.
 * Переваги:
 * 1. DRY — селектори в одному місці
 * 2. Читабельність — тести читаються як бізнес-сценарії
 * 3. Підтримка — зміна UI = зміна в одному файлі
 */
export class TodoPage {
  // Локатори — визначаємо один раз
  private readonly newTodoInput: Locator;
  private readonly todoItems: Locator;
  private readonly toggleAll: Locator;
  private readonly clearCompleted: Locator;
  private readonly todoCount: Locator;
  private readonly filterAll: Locator;
  private readonly filterActive: Locator;
  private readonly filterCompleted: Locator;

  constructor(private readonly page: Page) {
    // Стратегія селекторів (від найкращого до найгіршого):
    // 1. getByRole — найстабільніший, прив'язаний до accessibility
    // 2. getByTestId — якщо немає хорошої ролі
    // 3. getByText — для перевірки тексту
    // 4. CSS/XPath — останній варіант

    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.locator('.todo-list li');
    this.toggleAll = page.locator('.toggle-all');
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
    this.todoCount = page.locator('.todo-count');
    this.filterAll = page.getByRole('link', { name: 'All' });
    this.filterActive = page.getByRole('link', { name: 'Active' });
    this.filterCompleted = page.getByRole('link', { name: 'Completed' });
  }

  // --- Actions ---

  async goto() {
    await this.page.goto('/');
  }

  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
  }

  async addTodos(texts: string[]) {
    for (const text of texts) {
      await this.addTodo(text);
    }
  }

  async toggleTodo(text: string) {
    await this.todoItems
      .filter({ hasText: text })
      .getByRole('checkbox')
      .check();
  }

  async deleteTodo(text: string) {
    const item = this.todoItems.filter({ hasText: text });
    await item.hover();
    await item.getByRole('button', { name: 'Delete' }).click();
  }

  async editTodo(oldText: string, newText: string) {
    const item = this.todoItems.filter({ hasText: oldText });
    await item.dblclick();
    const editInput = item.getByRole('textbox');
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  async toggleAllTodos() {
    await this.toggleAll.check();
  }

  async clearCompletedTodos() {
    await this.clearCompleted.click();
  }

  async filterByAll() {
    await this.filterAll.click();
  }

  async filterByActive() {
    await this.filterActive.click();
  }

  async filterByCompleted() {
    await this.filterCompleted.click();
  }

  // --- Assertions (вбудовані в POM для зручності) ---

  async expectTodoCount(count: number) {
    await expect(this.todoItems).toHaveCount(count);
  }

  async expectTodoText(texts: string[]) {
    await expect(this.todoItems).toHaveText(texts);
  }

  async expectRemainingCount(count: number) {
    const text = count === 1 ? '1 item left' : `${count} items left`;
    await expect(this.todoCount).toHaveText(text);
  }

  async expectTodoCompleted(text: string) {
    await expect(
      this.todoItems.filter({ hasText: text })
    ).toHaveClass(/completed/);
  }

  async expectTodoNotCompleted(text: string) {
    await expect(
      this.todoItems.filter({ hasText: text })
    ).not.toHaveClass(/completed/);
  }
}
