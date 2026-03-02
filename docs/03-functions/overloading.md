# Перевантаження функцій

Function overloading дозволяє функції приймати різні типи параметрів і повертати різні типи.

## Проблема

Уяви функцію, що може приймати як рядок, так і число:

```typescript
// Без перевантаження — втрачаємо точність типу
function double(value: string | number): string | number {
  if (typeof value === 'string') {
    return value + value;
  }
  return value * 2;
}

const result = double('hello'); // string | number, а не string
```

## Рішення: Перевантаження

```typescript
// Сигнатури перевантаження
function double(value: string): string;
function double(value: number): number;
// Реалізація
function double(value: string | number): string | number {
  if (typeof value === 'string') {
    return value + value;
  }
  return value * 2;
}

const str = double('hello');  // string
const num = double(5);        // number
```

## Синтаксис

```typescript
// Сигнатури (видимі ззовні)
function functionName(params1): returnType1;
function functionName(params2): returnType2;

// Реалізація (не видима ззовні)
function functionName(params: combined): combinedReturn {
  // Логіка
}
```

## Правила перевантаження

### 1. Сигнатура реалізації не видима

```typescript
function greet(name: string): string;
function greet(names: string[]): string[];
function greet(input: string | string[]): string | string[] {
  // Цю сигнатуру не можна викликати напряму
}

greet('Anna');        // ✅ OK — перша сигнатура
greet(['Anna']);      // ✅ OK — друга сигнатура
greet(123);           // ❌ Помилка — немає такої сигнатури
```

### 2. Порядок має значення

Специфічніші сигнатури мають бути першими:

```typescript
// ❌ Погано — загальна сигнатура першою
function process(value: any): any;
function process(value: string): string;

// ✅ Добре — специфічна першою
function process(value: string): string;
function process(value: any): any;
```

### 3. Реалізація має бути сумісною з усіма сигнатурами

```typescript
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
```

## Практичні приклади

### createElement

```typescript
function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'div'): HTMLDivElement;
function createElement(tag: 'input'): HTMLInputElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const link = createElement('a');     // HTMLAnchorElement
const div = createElement('div');    // HTMLDivElement
const input = createElement('input'); // HTMLInputElement
const span = createElement('span');  // HTMLElement
```

### Парсинг даних

```typescript
function parse(value: string, type: 'number'): number;
function parse(value: string, type: 'boolean'): boolean;
function parse(value: string, type: 'json'): object;
function parse(value: string, type: string): number | boolean | object {
  switch (type) {
    case 'number':
      return parseFloat(value);
    case 'boolean':
      return value === 'true';
    case 'json':
      return JSON.parse(value);
    default:
      throw new Error('Unknown type');
  }
}

const num = parse('42', 'number');     // number
const bool = parse('true', 'boolean'); // boolean
const obj = parse('{}', 'json');       // object
```

### API Response

```typescript
interface User {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

function fetchData(endpoint: '/users'): Promise<ApiResponse<User[]>>;
function fetchData(endpoint: '/users/:id'): Promise<ApiResponse<User>>;
function fetchData(endpoint: string): Promise<ApiResponse<unknown>>;
async function fetchData(endpoint: string): Promise<ApiResponse<unknown>> {
  const response = await fetch(`/api${endpoint}`);
  return {
    data: await response.json(),
    status: response.status
  };
}

// TypeScript знає точний тип
const users = await fetchData('/users');      // ApiResponse<User[]>
const user = await fetchData('/users/:id');   // ApiResponse<User>
```

## Перевантаження методів класу

```typescript
class Calculator {
  add(a: number, b: number): number;
  add(a: string, b: string): string;
  add(a: number | string, b: number | string): number | string {
    if (typeof a === 'number' && typeof b === 'number') {
      return a + b;
    }
    return String(a) + String(b);
  }
}

const calc = new Calculator();
calc.add(1, 2);        // number
calc.add('a', 'b');    // string
```

## Альтернатива: Conditional Types

Іноді generic з conditional types кращий вибір:

```typescript
// Замість перевантаження
function double<T extends string | number>(
  value: T
): T extends string ? string : number {
  if (typeof value === 'string') {
    return (value + value) as any;
  }
  return (value as number * 2) as any;
}

const str = double('hello');  // string
const num = double(5);        // number
```

## Коли використовувати перевантаження

### Використовуй перевантаження:
- Різні типи параметрів дають різні типи результату
- Функція має декілька "режимів" роботи
- Потрібна точна типізація для IDE

### Уникай перевантаження:
- Якщо union type достатній
- Якщо логіка однакова для всіх типів
- Якщо можна використати generics

## Практичне завдання

```typescript
// 1. Створи функцію-перевантаження для reverse
function reverse(value: string): string;
function reverse(value: number[]): number[];
function reverse<T>(value: string | T[]): string | T[] {
  if (typeof value === 'string') {
    return value.split('').reverse().join('');
  }
  return [...value].reverse();
}

// 2. Створи функцію для отримання елемента
function getElement(selector: 'button'): HTMLButtonElement | null;
function getElement(selector: 'input'): HTMLInputElement | null;
function getElement(selector: string): HTMLElement | null;
function getElement(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}
```

## Висновок

Перевантаження функцій дозволяє точно типізувати функції з різною поведінкою залежно від параметрів. Використовуй його, коли потрібна точність типів, але розглядай generics як альтернативу.
