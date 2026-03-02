# Generic функції

Детальніше про використання generics у функціях.

## Базові приклади

```typescript
// Повернення того ж типу
function identity<T>(value: T): T {
  return value;
}

// Робота з масивами
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

function lastElement<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

// Кілька параметрів
function swap<T, U>(pair: [T, U]): [U, T] {
  return [pair[1], pair[0]];
}

const swapped = swap(['hello', 42]); // [number, string]
```

## Arrow Functions

```typescript
// Звичайний синтаксис
const identity = <T>(value: T): T => value;

// У JSX файлах потрібна кома (щоб відрізнити від тегу)
const identity = <T,>(value: T): T => value;

// Або extends
const identity = <T extends unknown>(value: T): T => value;
```

## Виведення типів

TypeScript автоматично виводить типи:

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// TypeScript виводить типи
const numbers = [1, 2, 3];
const strings = map(numbers, n => n.toString());
// T = number, U = string

// Явне вказання (рідко потрібно)
const strings2 = map<number, string>(numbers, n => n.toString());
```

## Callbacks з Generics

```typescript
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

function reduce<T, U>(
  arr: T[],
  reducer: (acc: U, item: T) => U,
  initial: U
): U {
  return arr.reduce(reducer, initial);
}

// Використання
const numbers = [1, 2, 3, 4, 5];
const evens = filter(numbers, n => n % 2 === 0);
const sum = reduce(numbers, (acc, n) => acc + n, 0);
```

## Higher-Order Functions

```typescript
// Функція, що повертає функцію
function createMapper<T, U>(fn: (item: T) => U): (arr: T[]) => U[] {
  return (arr) => arr.map(fn);
}

const doubleNumbers = createMapper<number, number>(n => n * 2);
console.log(doubleNumbers([1, 2, 3])); // [2, 4, 6]

// Composer
function compose<T, U, V>(
  f: (arg: U) => V,
  g: (arg: T) => U
): (arg: T) => V {
  return (arg) => f(g(arg));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const addOneThenDouble = compose(double, addOne);

console.log(addOneThenDouble(5)); // 12
```

## Currying

```typescript
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a) => (b) => fn(a, b);
}

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);

console.log(curriedAdd(5)(3)); // 8

const add5 = curriedAdd(5);
console.log(add5(10)); // 15
```

## Promise Functions

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

interface User {
  id: number;
  name: string;
}

const user = await fetchData<User>('/api/user/1');
// user: User

// Wrapper для помилок
async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error as Error];
  }
}

const [data, error] = await tryCatch(fetchData<User>('/api/user/1'));
if (error) {
  console.log('Error:', error.message);
} else {
  console.log('User:', data.name);
}
```

## Factory Functions

```typescript
function createFactory<T>(
  create: () => T
): { create: () => T; createMany: (count: number) => T[] } {
  return {
    create,
    createMany: (count) => Array.from({ length: count }, create)
  };
}

interface User {
  id: number;
  name: string;
}

let nextId = 1;
const userFactory = createFactory<User>(() => ({
  id: nextId++,
  name: `User ${nextId}`
}));

const user = userFactory.create();
const users = userFactory.createMany(5);
```

## Utility Functions

### pick / omit

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete (result as any)[key];
  });
  return result as Omit<T, K>;
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const user: User = { id: 1, name: 'Anna', email: 'a@b.com', password: 'secret' };
const publicUser = omit(user, ['password']);
// { id: number; name: string; email: string }
```

### groupBy

```typescript
function groupBy<T, K extends string | number>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

interface Product {
  name: string;
  category: string;
}

const products: Product[] = [
  { name: 'Apple', category: 'fruit' },
  { name: 'Banana', category: 'fruit' },
  { name: 'Carrot', category: 'vegetable' }
];

const grouped = groupBy(products, p => p.category);
// { fruit: [...], vegetable: [...] }
```

## Практичне завдання

```typescript
// 1. Створи функцію debounce
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// 2. Створи функцію memoize
function memoize<T extends (...args: any[]) => any>(
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// 3. Створи pipe функцію
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg) => fns.reduce((acc, fn) => fn(acc), arg);
}
```

## Висновок

Generic функції дозволяють писати типобезпечний, перевикористовуваний код. Використовуй їх для утилітних функцій, роботи з колекціями та створення абстракцій.
