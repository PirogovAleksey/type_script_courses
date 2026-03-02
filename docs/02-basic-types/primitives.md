# Примітивні типи

TypeScript підтримує всі примітивні типи JavaScript та додає свої.

::: tip Playground
[Відкрити приклади в TypeScript Playground](https://www.typescriptlang.org/play?#code/DYUwLgBAlgzgggOwJ4C4IENkCgDGB7EAEwgF4IAiAMQFEBJAbQF0BKCAfggG8IoI4kAZhACuEAFwQeQkWMky5ACgBmwMMHQZsufIVIUKVOo2ZtO3Hr36CRYyQBouM+YpXadew8bMW+QkdZcPPxC4ipO6po6+kYm5pbCNvYOLm6ePoF+gqGKKsZBoXoRJoggCMgQADYQYADuEKEAJj4CANwQGk2t7RDhkdEQMnW+PoJAA)

## string

Для текстових даних:

```typescript
let firstName: string = 'John';
let lastName: string = "Doe";
let greeting: string = `Hello, ${firstName}!`;
```

## number

Для всіх чисел (цілих, дробових, від'ємних):

```typescript
let age: number = 25;
let price: number = 99.99;
let negative: number = -10;
let hex: number = 0xff;
let binary: number = 0b1010;
```

## boolean

Для логічних значень:

```typescript
let isActive: boolean = true;
let isCompleted: boolean = false;
```

## null та undefined

```typescript
let empty: null = null;
let notDefined: undefined = undefined;
```

::: warning Увага
За замовчуванням `null` та `undefined` можна присвоїти будь-якому типу. Увімкни `strictNullChecks` в tsconfig для суворішої перевірки.
:::

## Виведення типів (Type Inference)

TypeScript автоматично визначає тип:

```typescript
let name = 'John';      // TypeScript знає, що це string
let count = 42;         // TypeScript знає, що це number
let isValid = true;     // TypeScript знає, що це boolean
```

Коли вказувати тип явно:

```typescript
// ✅ Явний тип потрібен
let data: string;  // Оголошення без ініціалізації
data = 'hello';

// ✅ Автовиведення працює
let message = 'Hello';  // Тип string виведено автоматично
```

## bigint

Для дуже великих чисел:

```typescript
let bigNumber: bigint = 9007199254740991n;
let anotherBig: bigint = BigInt(9007199254740991);
```

## symbol

Для унікальних ідентифікаторів:

```typescript
let id: symbol = Symbol('id');
let anotherId: symbol = Symbol('id');

console.log(id === anotherId); // false — кожен Symbol унікальний
```

## Літеральні типи

Можна обмежити значення конкретними варіантами:

```typescript
let direction: 'left' | 'right' | 'up' | 'down';
direction = 'left';   // ✅ OK
direction = 'center'; // ❌ Помилка!

let statusCode: 200 | 404 | 500;
statusCode = 200;     // ✅ OK
statusCode = 201;     // ❌ Помилка!
```

## Приклади використання

```typescript
// Функція з примітивними типами
function formatUser(name: string, age: number, isAdmin: boolean): string {
  const role = isAdmin ? 'Admin' : 'User';
  return `${name} (${age}) - ${role}`;
}

console.log(formatUser('John', 25, true));
// Output: "John (25) - Admin"

// Робота з null/undefined
function greet(name: string | null): string {
  if (name === null) {
    return 'Hello, Guest!';
  }
  return `Hello, ${name}!`;
}

console.log(greet('Anna'));  // "Hello, Anna!"
console.log(greet(null));    // "Hello, Guest!"
```

## Практичні завдання

::: tip Playground
[Відкрити завдання в Playground](https://www.typescriptlang.org/play?#code/PTAEFpK6dBhALAlgZ1AUwE4HsB2oDGANgIagBOkoAvKAN4C+oAZqJLIgFygDkAogBUA5ALIA1SkQAU-QaAAWAQxYBXUMm7IANKAAMASlDoAvKHRMA3OChxIBgGZxQoANYsA5pesBrEuhegRAFtJCFBzYJZWUEDMIA)
:::

### Завдання 1: Профіль користувача

```typescript
// Створи змінні для профілю:
let username: string = '';
let userAge: number = 0;
let isVerified: boolean = false;
let accountType: 'free' | 'premium' = 'free';
```

### Завдання 2: Функція форматування

```typescript
// Напиши функцію, що форматує ціну:
function formatPrice(amount: number, currency: string = 'UAH'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

// Тести:
console.log(formatPrice(99.5));        // "99.50 UAH"
console.log(formatPrice(100, 'USD'));  // "100.00 USD"
```

### Завдання 3: Типи для налаштувань

```typescript
// Створи типи для конфігурації:
type Theme = 'light' | 'dark' | 'system';
type Language = 'uk' | 'en' | 'de';

interface Settings {
  theme: Theme;
  language: Language;
  notifications: boolean;
  fontSize: number;
}

const defaultSettings: Settings = {
  theme: 'system',
  language: 'uk',
  notifications: true,
  fontSize: 16
};
```

### Завдання 4: Nullable значення

```typescript
// Напиши функцію, що безпечно отримує довжину:
function getLength(value: string | null | undefined): number {
  if (value == null) {
    return 0;
  }
  return value.length;
}

// Тести:
console.log(getLength('hello'));     // 5
console.log(getLength(null));        // 0
console.log(getLength(undefined));   // 0
```

## Висновок

Примітивні типи — основа TypeScript. У наступному уроці розглянемо масиви та кортежі.
