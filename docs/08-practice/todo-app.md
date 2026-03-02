# Проєкт: Todo App

Створимо типобезпечний Todo застосунок.

## Структура проєкту

```
todo-app/
├── src/
│   ├── types/
│   │   └── todo.ts
│   ├── services/
│   │   └── todoService.ts
│   ├── utils/
│   │   └── storage.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Крок 1: Типи

```typescript
// src/types/todo.ts

export type TodoStatus = 'pending' | 'in-progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
}

export type CreateTodoDto = Pick<Todo, 'title' | 'description' | 'priority' | 'dueDate' | 'tags'>;
export type UpdateTodoDto = Partial<Omit<Todo, 'id' | 'createdAt'>>;

export interface TodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  search?: string;
  tags?: string[];
}

export interface TodoStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}
```

## Крок 2: Storage Utility

```typescript
// src/utils/storage.ts

export class Storage<T> {
  constructor(private key: string) {}

  get(): T | null {
    const data = localStorage.getItem(this.key);
    if (!data) return null;

    try {
      return JSON.parse(data, this.reviver);
    } catch {
      return null;
    }
  }

  set(value: T): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  // Відновлення Date об'єктів
  private reviver(key: string, value: unknown): unknown {
    if (typeof value === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (dateRegex.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }
}
```

## Крок 3: Todo Service

```typescript
// src/services/todoService.ts

import { Todo, CreateTodoDto, UpdateTodoDto, TodoFilter, TodoStats } from '../types/todo';
import { Storage } from '../utils/storage';

export class TodoService {
  private storage = new Storage<Todo[]>('todos');
  private todos: Todo[] = [];

  constructor() {
    this.todos = this.storage.get() || [];
  }

  private save(): void {
    this.storage.set(this.todos);
  }

  private generateId(): string {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  create(dto: CreateTodoDto): Todo {
    const now = new Date();
    const todo: Todo = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      status: 'pending',
      priority: dto.priority,
      createdAt: now,
      updatedAt: now,
      dueDate: dto.dueDate,
      tags: dto.tags || []
    };

    this.todos.push(todo);
    this.save();
    return todo;
  }

  findById(id: string): Todo | undefined {
    return this.todos.find(todo => todo.id === id);
  }

  findAll(filter?: TodoFilter): Todo[] {
    let result = [...this.todos];

    if (filter?.status) {
      result = result.filter(todo => todo.status === filter.status);
    }

    if (filter?.priority) {
      result = result.filter(todo => todo.priority === filter.priority);
    }

    if (filter?.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(search) ||
        todo.description?.toLowerCase().includes(search)
      );
    }

    if (filter?.tags?.length) {
      result = result.filter(todo =>
        filter.tags!.some(tag => todo.tags.includes(tag))
      );
    }

    return result;
  }

  update(id: string, dto: UpdateTodoDto): Todo | null {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;

    this.todos[index] = {
      ...this.todos[index],
      ...dto,
      updatedAt: new Date()
    };

    this.save();
    return this.todos[index];
  }

  delete(id: string): boolean {
    const index = this.todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;

    this.todos.splice(index, 1);
    this.save();
    return true;
  }

  complete(id: string): Todo | null {
    return this.update(id, { status: 'completed' });
  }

  getStats(): TodoStats {
    const now = new Date();

    return {
      total: this.todos.length,
      pending: this.todos.filter(t => t.status === 'pending').length,
      inProgress: this.todos.filter(t => t.status === 'in-progress').length,
      completed: this.todos.filter(t => t.status === 'completed').length,
      overdue: this.todos.filter(t =>
        t.dueDate &&
        t.dueDate < now &&
        t.status !== 'completed'
      ).length
    };
  }

  getByPriority(): Record<string, Todo[]> {
    return {
      high: this.todos.filter(t => t.priority === 'high'),
      medium: this.todos.filter(t => t.priority === 'medium'),
      low: this.todos.filter(t => t.priority === 'low')
    };
  }

  getAllTags(): string[] {
    const tags = new Set<string>();
    this.todos.forEach(todo => {
      todo.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }
}
```

## Крок 4: Головний файл

```typescript
// src/index.ts

import { TodoService } from './services/todoService';
import type { CreateTodoDto, TodoFilter } from './types/todo';

// Ініціалізація сервісу
const todoService = new TodoService();

// Приклади використання

// Створення todo
const newTodo = todoService.create({
  title: 'Вивчити TypeScript',
  description: 'Пройти всі уроки курсу',
  priority: 'high',
  tags: ['навчання', 'програмування'],
  dueDate: new Date('2024-12-31')
});

console.log('Created:', newTodo);

// Створення ще кількох
todoService.create({
  title: 'Написати тести',
  priority: 'medium',
  tags: ['робота']
});

todoService.create({
  title: 'Прочитати документацію',
  priority: 'low',
  tags: ['навчання']
});

// Отримання всіх
console.log('All todos:', todoService.findAll());

// Фільтрація
const filter: TodoFilter = {
  priority: 'high',
  tags: ['навчання']
};
console.log('Filtered:', todoService.findAll(filter));

// Оновлення статусу
todoService.update(newTodo.id, { status: 'in-progress' });

// Завершення
todoService.complete(newTodo.id);

// Статистика
console.log('Stats:', todoService.getStats());

// Всі теги
console.log('Tags:', todoService.getAllTags());

// По пріоритету
console.log('By priority:', todoService.getByPriority());
```

## Крок 5: Розширення — Event System

```typescript
// src/services/todoEvents.ts

type TodoEventType = 'created' | 'updated' | 'deleted' | 'completed';

interface TodoEvent<T = unknown> {
  type: TodoEventType;
  payload: T;
  timestamp: Date;
}

type EventHandler<T> = (event: TodoEvent<T>) => void;

export class TodoEventEmitter {
  private handlers: Map<TodoEventType, Set<EventHandler<any>>> = new Map();

  on<T>(type: TodoEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Повертає функцію відписки
    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  emit<T>(type: TodoEventType, payload: T): void {
    const event: TodoEvent<T> = {
      type,
      payload,
      timestamp: new Date()
    };

    this.handlers.get(type)?.forEach(handler => handler(event));
  }
}

// Використання в TodoService
export class TodoServiceWithEvents extends TodoService {
  private events = new TodoEventEmitter();

  onCreate(handler: EventHandler<Todo>): () => void {
    return this.events.on('created', handler);
  }

  onUpdate(handler: EventHandler<Todo>): () => void {
    return this.events.on('updated', handler);
  }

  onDelete(handler: EventHandler<string>): () => void {
    return this.events.on('deleted', handler);
  }

  create(dto: CreateTodoDto): Todo {
    const todo = super.create(dto);
    this.events.emit('created', todo);
    return todo;
  }

  // ... override інших методів
}
```

## Крок 6: CLI Interface

```typescript
// src/cli.ts

import * as readline from 'readline';
import { TodoService } from './services/todoService';
import type { TodoPriority } from './types/todo';

const todoService = new TodoService();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('📝 Todo App CLI');
  console.log('Commands: list, add, complete, delete, stats, exit\n');

  while (true) {
    const command = await prompt('> ');

    switch (command.trim().toLowerCase()) {
      case 'list':
        const todos = todoService.findAll();
        if (todos.length === 0) {
          console.log('No todos yet.');
        } else {
          todos.forEach((todo, i) => {
            const status = todo.status === 'completed' ? '✅' : '⬜';
            console.log(`${i + 1}. ${status} [${todo.priority}] ${todo.title}`);
          });
        }
        break;

      case 'add':
        const title = await prompt('Title: ');
        const priority = await prompt('Priority (low/medium/high): ') as TodoPriority;
        todoService.create({ title, priority, tags: [] });
        console.log('Todo added!');
        break;

      case 'complete':
        const completeId = await prompt('Todo number: ');
        const todoToComplete = todoService.findAll()[parseInt(completeId) - 1];
        if (todoToComplete) {
          todoService.complete(todoToComplete.id);
          console.log('Completed!');
        }
        break;

      case 'delete':
        const deleteId = await prompt('Todo number: ');
        const todoToDelete = todoService.findAll()[parseInt(deleteId) - 1];
        if (todoToDelete) {
          todoService.delete(todoToDelete.id);
          console.log('Deleted!');
        }
        break;

      case 'stats':
        const stats = todoService.getStats();
        console.log(`Total: ${stats.total}`);
        console.log(`Pending: ${stats.pending}`);
        console.log(`In Progress: ${stats.inProgress}`);
        console.log(`Completed: ${stats.completed}`);
        break;

      case 'exit':
        console.log('Bye!');
        rl.close();
        process.exit(0);

      default:
        console.log('Unknown command');
    }
    console.log();
  }
}

main();
```

## Що ми використали

- **Типи**: interfaces, type aliases, union types
- **Generics**: `Storage<T>`, Event handlers
- **Класи**: TodoService з інкапсуляцією
- **Модулі**: Організація по папках
- **Utility Types**: `Pick`, `Partial`, `Omit`

## Подальші ідеї

1. Додати підтримку підзадач
2. Реалізувати пошук по датах
3. Додати нотифікації про дедлайни
4. Інтегрувати з REST API
5. Створити React/Vue інтерфейс
