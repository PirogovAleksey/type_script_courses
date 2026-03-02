# Interfaces

Interface — спосіб описати форму об'єкта в TypeScript.

## Базовий синтаксис

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Anna',
  email: 'anna@example.com'
};
```

## Опціональні властивості

```typescript
interface User {
  id: number;
  name: string;
  email?: string;      // Опціонально
  phone?: string;      // Опціонально
}

// Всі варіанти валідні
const user1: User = { id: 1, name: 'Anna' };
const user2: User = { id: 2, name: 'John', email: 'john@example.com' };
```

## Readonly властивості

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
point.x = 5; // ❌ Помилка: не можна змінювати readonly
```

## Методи в інтерфейсах

```typescript
interface User {
  id: number;
  name: string;
  greet(): string;
  updateEmail(email: string): void;
}

const user: User = {
  id: 1,
  name: 'Anna',
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  updateEmail(email) {
    console.log(`Email updated to ${email}`);
  }
};
```

### Два способи описати метод

```typescript
interface Calculator {
  // Спосіб 1: як властивість-функцію
  add: (a: number, b: number) => number;

  // Спосіб 2: як метод
  subtract(a: number, b: number): number;
}
```

## Index Signatures

Для об'єктів з динамічними ключами:

```typescript
interface Dictionary {
  [key: string]: string;
}

const translations: Dictionary = {
  hello: 'привіт',
  world: 'світ',
  typescript: 'тайпскрипт'
};
```

### Комбінування з фіксованими властивостями

```typescript
interface Config {
  version: string;
  [key: string]: string | number | boolean;
}

const config: Config = {
  version: '1.0.0',
  debug: true,
  maxRetries: 3,
  apiUrl: 'https://api.example.com'
};
```

## Розширення інтерфейсів (extends)

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: 'Anna',
  age: 28,
  employeeId: 12345,
  department: 'Engineering'
};
```

### Множинне розширення

```typescript
interface HasName {
  name: string;
}

interface HasEmail {
  email: string;
}

interface User extends HasName, HasEmail {
  id: number;
}

const user: User = {
  id: 1,
  name: 'Anna',
  email: 'anna@example.com'
};
```

## Інтерфейси для функцій

```typescript
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;
```

### Callable з властивостями

```typescript
interface Counter {
  (): number;           // Можна викликати
  count: number;        // Має властивість
  reset(): void;        // Має метод
}

function createCounter(): Counter {
  let count = 0;

  const counter = function() {
    return ++count;
  } as Counter;

  counter.count = count;
  counter.reset = function() {
    count = 0;
    counter.count = 0;
  };

  return counter;
}
```

## Інтерфейси для класів

```typescript
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

class Document implements Printable, Serializable {
  constructor(public content: string) {}

  print(): void {
    console.log(this.content);
  }

  serialize(): string {
    return JSON.stringify({ content: this.content });
  }
}
```

## Declaration Merging

Інтерфейси з однаковими іменами об'єднуються:

```typescript
interface User {
  name: string;
}

interface User {
  email: string;
}

// Результат:
// interface User {
//   name: string;
//   email: string;
// }

const user: User = {
  name: 'Anna',
  email: 'anna@example.com'
};
```

## Практичні приклади

### API Response

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: 'Anna' },
  status: 200,
  message: 'Success',
  timestamp: new Date()
};
```

### React Props (концептуально)

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

function Button(props: ButtonProps) {
  // Реалізація
}
```

### Event Handler

```typescript
interface ClickEvent {
  x: number;
  y: number;
  target: HTMLElement;
  preventDefault(): void;
}

interface EventHandler {
  (event: ClickEvent): void;
}

const handleClick: EventHandler = (event) => {
  console.log(`Clicked at ${event.x}, ${event.y}`);
};
```

## Практичне завдання

```typescript
// 1. Створи інтерфейс для товару
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  inStock: boolean;
}

// 2. Розшир інтерфейс для товару зі знижкою
interface DiscountedProduct extends Product {
  originalPrice: number;
  discountPercent: number;
}

// 3. Створи інтерфейс для кошика
interface Cart {
  items: Product[];
  total: number;
  addItem(product: Product): void;
  removeItem(productId: number): void;
}
```

## Висновок

Інтерфейси — потужний інструмент для опису форми даних. Вони підтримують розширення, опціональні властивості, readonly та declaration merging. У наступному уроці порівняємо їх з type aliases.
