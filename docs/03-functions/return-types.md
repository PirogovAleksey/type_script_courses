# Типи повернення

TypeScript дозволяє явно вказувати, що повертає функція.

## Базовий синтаксис

```typescript
function add(a: number, b: number): number {
  return a + b;
}

function greet(name: string): string {
  return `Hello, ${name}!`;
}

function isAdult(age: number): boolean {
  return age >= 18;
}
```

## Автоматичне виведення типу

TypeScript може вивести тип повернення автоматично:

```typescript
function multiply(a: number, b: number) {
  return a * b; // TypeScript виводить: number
}

const result = multiply(5, 3); // result: number
```

### Коли вказувати явно?

```typescript
// ✅ Рекомендовано для публічних API
export function calculateTax(amount: number): number {
  return amount * 0.2;
}

// ✅ Рекомендовано для складних функцій
function processData(input: unknown): string | null {
  if (typeof input === 'string') return input;
  if (typeof input === 'number') return input.toString();
  return null;
}

// Можна покластися на виведення для простих випадків
const double = (n: number) => n * 2;
```

## void

Функція нічого не повертає:

```typescript
function logMessage(message: string): void {
  console.log(message);
}

function saveToDatabase(data: object): void {
  // Зберігає дані, нічого не повертає
  database.save(data);
}
```

### void vs undefined

```typescript
function returnVoid(): void {
  // Можна не писати return
}

function returnUndefined(): undefined {
  return undefined; // Обов'язково повертати undefined
}
```

## never

Функція ніколи не завершується нормально:

```typescript
// Завжди кидає помилку
function throwError(message: string): never {
  throw new Error(message);
}

// Нескінченний цикл
function forever(): never {
  while (true) {
    // ...
  }
}
```

### never у exhaustive checks

```typescript
type Animal = 'cat' | 'dog' | 'bird';

function getSound(animal: Animal): string {
  switch (animal) {
    case 'cat':
      return 'meow';
    case 'dog':
      return 'woof';
    case 'bird':
      return 'chirp';
    default:
      // Якщо додамо нового animal і забудемо — помилка компіляції
      const _exhaustive: never = animal;
      return _exhaustive;
  }
}
```

## Повернення об'єктів

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email
  };
}
```

### Inline типи

```typescript
function getCoordinates(): { x: number; y: number } {
  return { x: 10, y: 20 };
}
```

## Повернення масивів

```typescript
function getNumbers(): number[] {
  return [1, 2, 3, 4, 5];
}

function getUsers(): User[] {
  return [
    { id: 1, name: 'Anna', email: 'anna@example.com' },
    { id: 2, name: 'John', email: 'john@example.com' }
  ];
}
```

## Повернення кортежів

```typescript
function getMinMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
console.log(min, max); // 1, 9
```

## Union типи в поверненні

```typescript
function findUser(id: number): User | null {
  const user = database.find(u => u.id === id);
  return user || null;
}

function parseInput(input: string): number | string {
  const parsed = parseFloat(input);
  return isNaN(parsed) ? input : parsed;
}
```

## Promise типи

```typescript
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  return response.json();
}

// Promise з можливою помилкою
async function tryFetch(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    return response.text();
  } catch {
    return null;
  }
}
```

## Функції вищого порядку

```typescript
// Функція, що повертає функцію
function createMultiplier(factor: number): (n: number) => number {
  return (n) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

## Type assertions у поверненні

```typescript
function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

// Або з assertion
function getInputElement(id: string): HTMLInputElement {
  return document.getElementById(id) as HTMLInputElement;
}
```

## Практичні приклади

### Result Pattern

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.data); // 5
} else {
  console.log(result.error);
}
```

### Builder Pattern

```typescript
interface QueryBuilder {
  select(fields: string[]): QueryBuilder;
  from(table: string): QueryBuilder;
  where(condition: string): QueryBuilder;
  build(): string;
}

function createQueryBuilder(): QueryBuilder {
  let query = { fields: ['*'], table: '', conditions: [] as string[] };

  return {
    select(fields) {
      query.fields = fields;
      return this;
    },
    from(table) {
      query.table = table;
      return this;
    },
    where(condition) {
      query.conditions.push(condition);
      return this;
    },
    build() {
      let sql = `SELECT ${query.fields.join(', ')} FROM ${query.table}`;
      if (query.conditions.length) {
        sql += ` WHERE ${query.conditions.join(' AND ')}`;
      }
      return sql;
    }
  };
}
```

## Практичне завдання

```typescript
// 1. Напиши функцію, що повертає Promise з User або null
async function findUserByEmail(email: string): Promise<User | null> {
  // Твоя реалізація
}

// 2. Напиши функцію, що повертає функцію
function createFormatter(prefix: string): (value: string) => string {
  return (value) => `${prefix}: ${value}`;
}
```

## Висновок

Типи повернення допомагають зрозуміти, що очікувати від функції. Використовуй `void` для функцій без повернення, `never` для функцій, що не завершуються, та `Promise<T>` для асинхронних операцій.
