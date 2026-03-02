# Типізація параметрів

Функції — основа будь-якої програми. TypeScript дозволяє типізувати їх параметри.

::: tip Playground
[Відкрити приклади в TypeScript Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMGAbKBTATgRgDwAqAfABQCUiA3gFCKKoCeADuvcgFyLpQjIC2AIwgAnGIhYgcAcwA0iAIaJsuAsTJUadRi3aceAoSPFSZ8xcvWN2nbr35DR4ydJoB6R4gC8vxIgDaAXUQAXwio6Jj-CQkpGXlFZVV1TW1dPSh9IxNzS2s7R2cXDy8fPwCgkLCI6LiE5OSUtKgMiSA)

## Базова типізація

```typescript
function greet(name: string, age: number): void {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

greet('Anna', 25);     // ✅ OK
greet('Anna', '25');   // ❌ Помилка: string замість number
greet('Anna');         // ❌ Помилка: не вистачає аргументу
```

## Опціональні параметри

Додай `?` після імені параметра:

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}

greet('Anna');            // "Hello, Anna!"
greet('Anna', 'Hi');      // "Hi, Anna!"
```

::: warning Увага
Опціональні параметри мають бути в кінці списку параметрів.
:::

```typescript
// ❌ Помилка
function wrong(a?: string, b: number) {}

// ✅ OK
function correct(a: number, b?: string) {}
```

## Параметри за замовчуванням

```typescript
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

greet('Anna');           // "Hello, Anna!"
greet('Anna', 'Hi');     // "Hi, Anna!"
```

Параметри за замовчуванням можуть бути в будь-якому місці:

```typescript
function createUser(
  name: string,
  role: string = 'user',
  isActive: boolean
) {
  return { name, role, isActive };
}

createUser('Anna', undefined, true);
// { name: 'Anna', role: 'user', isActive: true }
```

## Rest параметри

Для невизначеної кількості аргументів:

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3);        // 6
sum(1, 2, 3, 4, 5);  // 15
```

### Комбінування з іншими параметрами

```typescript
function log(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, ...messages);
}

log('INFO', 'Server started', 'Port 3000');
// [INFO] Server started Port 3000
```

## Деструктуризація параметрів

```typescript
interface User {
  name: string;
  age: number;
  email: string;
}

function printUser({ name, age }: User): void {
  console.log(`${name} is ${age} years old`);
}

// Або з типом inline
function printCoords({ x, y }: { x: number; y: number }): void {
  console.log(`Coordinates: ${x}, ${y}`);
}

printCoords({ x: 10, y: 20 });
```

## Callback функції

```typescript
function processArray(
  items: number[],
  callback: (item: number, index: number) => void
): void {
  items.forEach((item, index) => callback(item, index));
}

processArray([1, 2, 3], (item, index) => {
  console.log(`Item ${index}: ${item}`);
});
```

## Типи функцій

### Function Type Expression

```typescript
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;
```

### Call Signatures

```typescript
type Calculator = {
  (a: number, b: number): number;
  description: string;
};

const calculator: Calculator = (a, b) => a + b;
calculator.description = 'Adds two numbers';
```

## this параметр

```typescript
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'Anna',
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

user.greet(); // "Hello, I'm Anna"
```

## Практичні приклади

### Функція валідації

```typescript
function validateEmail(
  email: string,
  onSuccess: (email: string) => void,
  onError: (message: string) => void
): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailRegex.test(email)) {
    onSuccess(email);
  } else {
    onError('Invalid email format');
  }
}

validateEmail(
  'test@example.com',
  (email) => console.log(`Valid: ${email}`),
  (error) => console.log(`Error: ${error}`)
);
```

### Фабрична функція

```typescript
function createCounter(
  initialValue: number = 0,
  step: number = 1
): { increment: () => number; decrement: () => number; getValue: () => number } {
  let count = initialValue;

  return {
    increment: () => count += step,
    decrement: () => count -= step,
    getValue: () => count
  };
}

const counter = createCounter(10, 2);
console.log(counter.increment()); // 12
console.log(counter.increment()); // 14
console.log(counter.decrement()); // 12
```

## Практичні завдання

::: tip Playground
[Відкрити завдання в Playground](https://www.typescriptlang.org/play?#code/PTAEFpK6dBhALAlgZ1ACgJYDsDOAXUATwAdJQBvAXwChRQAPCPAE0gBsGBXSAG0kvQCGAYwD2Ad0gBeUABEB-PkNHiAfKADaAXVABKDTv1DJ0mfMXKVa9lp16Dho6fOWVNnfqMnTF6xxYAaF3cPTW0rOz9HZycXd01tSN0TM0trGP8Ax0TE7SgUlOMzSxMiIA)
:::

### Завдання 1: Форматування ціни

```typescript
function formatPrice(
  amount: number,
  currency: string = 'UAH',
  locale: string = 'uk-UA'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// Тести:
console.log(formatPrice(1234.5));          // "1 234,50 ₴"
console.log(formatPrice(99.99, 'USD'));    // "$99.99"
```

### Завдання 2: Функція з callback

```typescript
function fetchData<T>(
  url: string,
  onSuccess: (data: T) => void,
  onError?: (error: Error) => void
): void {
  fetch(url)
    .then(res => res.json())
    .then(onSuccess)
    .catch(err => onError?.(err));
}
```

### Завдання 3: Функція пошуку

```typescript
function findInArray<T>(
  arr: T[],
  predicate: (item: T, index: number) => boolean
): T | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return arr[i];
    }
  }
  return undefined;
}

// Тести:
const numbers = [1, 2, 3, 4, 5];
const found = findInArray(numbers, n => n > 3);
console.log(found); // 4
```

### Завдання 4: Retry функція

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Unreachable');
}
```

## Висновок

Типізація параметрів робить функції надійнішими та зрозумілішими. У наступному уроці розглянемо типи повернення функцій.
