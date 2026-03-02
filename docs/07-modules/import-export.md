# Import та Export

Модулі дозволяють організувати код у окремі файли.

## Named Exports

Експорт кількох елементів з одного файлу:

```typescript
// math.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export interface MathResult {
  value: number;
  operation: string;
}
```

### Named Imports

```typescript
// app.ts
import { PI, add, multiply, MathResult } from './math';

console.log(PI);         // 3.14159
console.log(add(2, 3));  // 5

const result: MathResult = {
  value: multiply(4, 5),
  operation: 'multiply'
};
```

### Перейменування при імпорті

```typescript
import { add as sum, multiply as mult } from './math';

console.log(sum(2, 3));   // 5
console.log(mult(4, 5));  // 20
```

## Default Export

Один головний експорт з файлу:

```typescript
// User.ts
export default class User {
  constructor(
    public name: string,
    public email: string
  ) {}

  greet(): string {
    return `Hello, ${this.name}!`;
  }
}
```

### Default Import

```typescript
// app.ts
import User from './User';

const user = new User('Anna', 'anna@example.com');
console.log(user.greet());
```

### Комбінування default та named

```typescript
// api.ts
export default class ApiClient {
  // ...
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const DEFAULT_TIMEOUT = 5000;
```

```typescript
// app.ts
import ApiClient, { ApiConfig, DEFAULT_TIMEOUT } from './api';
```

## Import All

```typescript
import * as Math from './math';

console.log(Math.PI);
console.log(Math.add(2, 3));
```

## Re-exports

Агрегація експортів:

```typescript
// models/User.ts
export interface User { id: number; name: string; }

// models/Product.ts
export interface Product { id: number; title: string; }

// models/index.ts — barrel file
export { User } from './User';
export { Product } from './Product';
export * from './Order';  // Експортувати все

// Або з перейменуванням
export { User as UserModel } from './User';
```

```typescript
// app.ts
import { User, Product } from './models';
```

## Type-Only Imports

Імпорт тільки типів (видаляється при компіляції):

```typescript
// types.ts
export interface User {
  id: number;
  name: string;
}

export class UserService {
  // ...
}
```

```typescript
// app.ts
import type { User } from './types';
import { UserService } from './types';

// Або inline
import { type User, UserService } from './types';

// User доступний тільки як тип
const user: User = { id: 1, name: 'Anna' };
```

## Dynamic Imports

```typescript
async function loadModule() {
  const { add, multiply } = await import('./math');
  console.log(add(2, 3));
}

// Умовний імпорт
async function getFormatter(locale: string) {
  if (locale === 'uk') {
    return import('./formatters/uk');
  }
  return import('./formatters/en');
}
```

## Організація проєкту

### Типова структура

```
src/
├── index.ts           # Entry point
├── types/
│   ├── index.ts       # Barrel file
│   ├── user.ts
│   └── product.ts
├── services/
│   ├── index.ts
│   ├── userService.ts
│   └── apiService.ts
├── utils/
│   ├── index.ts
│   ├── helpers.ts
│   └── validators.ts
└── components/
    └── ...
```

### Barrel Files

```typescript
// services/index.ts
export { UserService } from './userService';
export { ApiService } from './apiService';
export { default as AuthService } from './authService';
```

```typescript
// app.ts — чистий імпорт
import { UserService, ApiService, AuthService } from './services';
```

## Типи модулів

### ES Modules (рекомендовано)

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### CommonJS

```typescript
// Експорт
module.exports = { add, multiply };
exports.PI = 3.14159;

// Імпорт
const { add } = require('./math');
```

### Interop

```typescript
// esModuleInterop дозволяє:
import express from 'express';  // Замість: import * as express

// Без esModuleInterop:
import * as express from 'express';
const app = express.default();
```

## Практичні приклади

### API Module

```typescript
// api/types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}
```

```typescript
// api/client.ts
import type { ApiResponse, RequestConfig } from './types';

export class ApiClient {
  constructor(private baseUrl: string) {}

  async request<T>(endpoint: string, config: RequestConfig): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: config.method,
      headers: config.headers,
      body: config.body ? JSON.stringify(config.body) : undefined
    });

    return {
      data: await response.json(),
      status: response.status
    };
  }
}
```

```typescript
// api/index.ts
export { ApiClient } from './client';
export type { ApiResponse, RequestConfig } from './types';
```

### Utils Module

```typescript
// utils/validators.ts
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isRequired(value: unknown): boolean {
  return value !== null && value !== undefined && value !== '';
}

export function minLength(min: number) {
  return (value: string): boolean => value.length >= min;
}
```

```typescript
// utils/formatters.ts
export function formatCurrency(amount: number, currency = 'UAH'): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('uk-UA').format(date);
}
```

```typescript
// utils/index.ts
export * from './validators';
export * from './formatters';
```

## Практичне завдання

```typescript
// 1. Створи модуль для роботи з користувачами

// types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type CreateUserDto = Omit<User, 'id'>;

// services/userService.ts
import type { User, CreateUserDto } from '../types/user';

export class UserService {
  private users: User[] = [];
  private nextId = 1;

  create(data: CreateUserDto): User {
    const user = { ...data, id: this.nextId++ };
    this.users.push(user);
    return user;
  }

  findById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findAll(): User[] {
    return [...this.users];
  }
}

// index.ts
export { UserService } from './services/userService';
export type { User, CreateUserDto } from './types/user';
```

## Висновок

- Named exports для кількох елементів
- Default export для головного елемента модуля
- Type-only imports для типів
- Barrel files для зручної організації
- Dynamic imports для code splitting
