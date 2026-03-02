# Enum, Any, Unknown

## Enum (Перерахування)

Enum дозволяє створити набір іменованих констант.

### Числовий Enum

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

let move: Direction = Direction.Up;
console.log(move); // 0
```

### Enum з власними значеннями

```typescript
enum Direction {
  Up = 1,
  Down = 2,
  Left = 3,
  Right = 4
}

// Або з певного числа
enum Status {
  Pending = 100,
  Active,      // 101
  Completed    // 102
}
```

### Рядковий Enum

```typescript
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

let favoriteColor: Color = Color.Red;
console.log(favoriteColor); // "RED"
```

### Практичне використання Enum

```typescript
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500
}

function handleResponse(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:
      return 'Success!';
    case HttpStatus.NotFound:
      return 'Resource not found';
    case HttpStatus.ServerError:
      return 'Server error';
    default:
      return 'Unknown status';
  }
}
```

### const Enum

Більш оптимізована версія:

```typescript
const enum Direction {
  Up = 'UP',
  Down = 'DOWN'
}

let dir = Direction.Up; // Компілюється в: let dir = "UP"
```

### Альтернатива: Union Types

Часто union types кращий вибір:

```typescript
// Замість enum
type Direction = 'up' | 'down' | 'left' | 'right';

let move: Direction = 'up';
```

## Any

`any` вимикає перевірку типів. **Уникай його!**

```typescript
let data: any = 'hello';
data = 42;           // OK
data = { x: 1 };     // OK
data.foo();          // OK (але може впасти!)
data.bar.baz;        // OK (але може впасти!)
```

### Коли any допустимий

```typescript
// 1. Міграція з JavaScript
function legacyFunction(data: any) {
  // Поступово типізуємо
}

// 2. Робота з динамічними даними (тимчасово)
const response: any = await fetch('/api').then(r => r.json());
```

::: danger Небезпека
`any` знімає всі гарантії TypeScript. Краще використовувати `unknown`.
:::

## Unknown

`unknown` — безпечна альтернатива `any`. Вимагає перевірки типу перед використанням.

```typescript
let value: unknown = 'hello';

// ❌ Не можна використовувати напряму
value.toUpperCase(); // Помилка!

// ✅ Потрібна перевірка типу
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // OK
}
```

### Практичний приклад

```typescript
function processInput(input: unknown): string {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  if (typeof input === 'number') {
    return input.toString();
  }
  if (input instanceof Date) {
    return input.toISOString();
  }
  return 'Unknown type';
}

console.log(processInput('hello'));     // "HELLO"
console.log(processInput(42));          // "42"
console.log(processInput(new Date()));  // ISO string
```

### Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript знає, що value — string
    console.log(value.toUpperCase());
  }
}
```

## Порівняння any vs unknown

| Аспект | any | unknown |
|--------|-----|---------|
| Присвоєння | Будь-що | Будь-що |
| Використання | Без перевірок | Потрібна перевірка |
| Безпека | Немає | Є |
| Рекомендація | Уникати | Використовувати |

## void та never

### void

Для функцій, що нічого не повертають:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // return не потрібен або return без значення
}
```

### never

Для функцій, що ніколи не завершуються:

```typescript
// Функція, що завжди кидає помилку
function throwError(message: string): never {
  throw new Error(message);
}

// Нескінченний цикл
function infiniteLoop(): never {
  while (true) {
    // ...
  }
}

// Exhaustive check
type Shape = 'circle' | 'square';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 10 * 10;
    case 'square':
      return 10 * 10;
    default:
      // Якщо додамо новий тип і забудемо обробити — помилка
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

## Практичне завдання

```typescript
// 1. Створи enum для статусів замовлення
enum OrderStatus {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED'
}

// 2. Напиши функцію з unknown
function safeJsonParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// 3. Перевір тип перед використанням
const data = safeJsonParse('{"name": "John"}');
if (data && typeof data === 'object' && 'name' in data) {
  console.log((data as { name: string }).name);
}
```

## Висновок

- **Enum** — для фіксованих наборів значень (або використовуй union types)
- **any** — уникай, вимикає типізацію
- **unknown** — безпечна альтернатива any
- **void** — функція нічого не повертає
- **never** — функція ніколи не завершується
