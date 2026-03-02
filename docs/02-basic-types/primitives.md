# Примітивні типи

TypeScript підтримує всі примітивні типи JavaScript та додає свої.

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

## Практичне завдання

Створи змінні для профілю користувача:

```typescript
// Твій код тут:
let username: string = '';
let userAge: number = 0;
let isVerified: boolean = false;
let accountType: 'free' | 'premium' = 'free';
```

## Висновок

Примітивні типи — основа TypeScript. У наступному уроці розглянемо масиви та кортежі.
