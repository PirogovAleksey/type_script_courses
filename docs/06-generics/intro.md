# Вступ до Generics

Generics дозволяють створювати компоненти, що працюють з різними типами.

::: tip Playground
[Відкрити приклади в TypeScript Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMAFADwFyLCAWwKYBOAFFAIYA2UAFAE4CUiA3gFCKKYQyIDOT6UWvRYA6AOYAaRAAtOuAsTKUadBk1bsu3XvyGjxk6bOGL6TNpx79Bo8VMky5i5WsDqteozfsuBYiZNnM+M4y8oo+qtb+qo5hLm4e0V4+-kGhKhFR0cmubh5JGr76RqbmlsFWdrbxjslunt7BFYE1deH1UQ2ejc2tbdVddb0Dg8OjzuOT09MTc-ML7UtAA)

## Проблема без Generics

```typescript
// Версія для number
function identityNumber(arg: number): number {
  return arg;
}

// Версія для string
function identityString(arg: string): string {
  return arg;
}

// Або з any (втрачаємо типізацію)
function identityAny(arg: any): any {
  return arg;
}

const result = identityAny('hello');
// result має тип any, а не string!
```

## Рішення: Generics

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42);        // num: number
const str = identity('hello');   // str: string
const bool = identity(true);     // bool: boolean
```

`T` — це **параметр типу** (type parameter). Він зберігає тип, переданий при виклику.

## Синтаксис

```typescript
// Функція
function func<T>(arg: T): T { ... }

// Arrow function
const func = <T>(arg: T): T => { ... };

// Interface
interface Container<T> {
  value: T;
}

// Type
type Wrapper<T> = { data: T };

// Class
class Box<T> {
  constructor(public value: T) {}
}
```

## Явне вказання типу

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Автоматичне виведення
const a = identity('hello');     // T = string

// Явне вказання
const b = identity<string>('hello');
const c = identity<number>(42);
```

## Кілька параметрів типу

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair('hello', 42);
// result: [string, number]

// Map-like
function mapObject<K, V>(key: K, value: V): Map<K, V> {
  return new Map([[key, value]]);
}
```

## Generic Interfaces

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: 'Anna' },
  status: 200,
  message: 'Success'
};

// Array-like interface
interface List<T> {
  items: T[];
  add(item: T): void;
  get(index: number): T | undefined;
}
```

## Generic Type Aliases

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { ok: false, error: 'Division by zero' };
  }
  return { ok: true, value: a / b };
}

const result = divide(10, 2);
if (result.ok) {
  console.log(result.value); // 5
} else {
  console.log(result.error);
}
```

## Значення за замовчуванням

```typescript
interface Container<T = string> {
  value: T;
}

const strContainer: Container = { value: 'hello' };       // T = string
const numContainer: Container<number> = { value: 42 };    // T = number

// Кілька параметрів
type Response<T = unknown, E = Error> = {
  data: T;
  error?: E;
};
```

## Практичні приклади

### Nullable wrapper

```typescript
type Nullable<T> = T | null;

function getNullable<T>(value: T, shouldBeNull: boolean): Nullable<T> {
  return shouldBeNull ? null : value;
}

const maybeString: Nullable<string> = getNullable('hello', false);
```

### Promise-like

```typescript
interface AsyncResult<T> {
  loading: boolean;
  data?: T;
  error?: Error;
}

function useAsync<T>(): AsyncResult<T> {
  return { loading: true };
}

const userResult: AsyncResult<User> = useAsync<User>();
```

### Event Emitter

```typescript
type EventMap = {
  click: { x: number; y: number };
  submit: { data: FormData };
  error: { message: string };
};

interface EventEmitter<T extends Record<string, unknown>> {
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void;
  emit<K extends keyof T>(event: K, payload: T[K]): void;
}

// Використання
declare const emitter: EventEmitter<EventMap>;
emitter.on('click', (payload) => {
  console.log(payload.x, payload.y); // TypeScript знає типи
});
```

## Коли використовувати Generics

### Використовуй:
- Коли функція/клас працює з різними типами однаково
- Для збереження зв'язку між типами (вхід → вихід)
- Для створення перевикористовуваних компонентів

### Не використовуй:
- Якщо функція працює тільки з одним типом
- Якщо union type достатній
- Для простих випадків

```typescript
// ❌ Зайвий generic
function greet<T extends string>(name: T): string {
  return `Hello, ${name}`;
}

// ✅ Краще
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

## Практичне завдання

```typescript
// 1. Створи generic функцію для отримання першого елемента
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 2. Створи generic interface для пагінації
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 3. Створи generic type для async стану
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## Висновок

Generics — потужний інструмент для створення типобезпечних, перевикористовуваних компонентів. У наступних уроках розглянемо generic функції та класи детальніше.
