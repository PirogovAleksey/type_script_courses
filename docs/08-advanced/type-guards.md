# Type Guards та Assertion Functions

Type Guards дозволяють звузити тип змінної в певному блоці коду.

::: tip Playground
[Відкрити в TypeScript Playground](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABMOcAUAPAlIg3gKESMQCcBTKEYpAGwEMAbRgLkTBAFsAjVgbiqIB6IYgC8iRAG0AugG5GAX0aMoITJRp0m+NhyJTefMD35CR4yQCp1G7br0GjqjVoC0duswAWYR-eZWIDZ2DiR+gcFYoeZRQA)
:::

## typeof Guard

Перевірка примітивних типів:

```typescript
function process(value: string | number) {
  if (typeof value === 'string') {
    // TypeScript знає, що value — string
    console.log(value.toUpperCase());
  } else {
    // TypeScript знає, що value — number
    console.log(value.toFixed(2));
  }
}
```

### Типи для typeof

```typescript
typeof x === 'string'
typeof x === 'number'
typeof x === 'boolean'
typeof x === 'undefined'
typeof x === 'object'   // null також!
typeof x === 'function'
typeof x === 'symbol'
typeof x === 'bigint'
```

## instanceof Guard

Перевірка класів:

```typescript
class Dog {
  bark() { console.log('Woof!'); }
}

class Cat {
  meow() { console.log('Meow!'); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

## in Operator

Перевірка наявності властивості:

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

## Discriminated Unions

Найпотужніший патерн для type guards:

```typescript
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

interface Triangle {
  kind: 'triangle';
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
  }
}
```

### Exhaustive Check

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    case 'triangle':
      return (shape.base * shape.height) / 2;
    default:
      // Якщо додамо новий тип і забудемо обробити — помилка!
      return assertNever(shape);
  }
}
```

## Custom Type Guards

Створення власних type guards з `is`:

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

// Type predicate: value is Fish
function isFish(value: Fish | Bird): value is Fish {
  return 'swim' in value;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    // TypeScript знає, що animal — Fish
    animal.swim();
  } else {
    // TypeScript знає, що animal — Bird
    animal.fly();
  }
}
```

### Приклади Type Guards

```typescript
// Перевірка на null/undefined
function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values = [1, null, 2, undefined, 3];
const numbers = values.filter(isNotNull);
// numbers: number[]

// Перевірка на масив
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

// Перевірка на об'єкт
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Перевірка на конкретний інтерфейс
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    isObject(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string'
  );
}
```

## Assertion Functions

Функції, що гарантують тип або кидають помилку:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
}

function process(value: unknown) {
  assertIsString(value);
  // Після assertion TypeScript знає, що value — string
  console.log(value.toUpperCase());
}
```

### asserts vs is

```typescript
// Type guard з is — повертає boolean
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

// Assertion function — кидає помилку або нічого не повертає
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
}

function example(value: unknown) {
  // З is — потрібен if
  if (isString(value)) {
    value.toUpperCase();
  }

  // З asserts — без if, але може кинути помилку
  assertIsString(value);
  value.toUpperCase();
}
```

### Assert Condition

```typescript
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function divide(a: number, b: number): number {
  assert(b !== 0, 'Division by zero');
  // TypeScript знає, що b !== 0
  return a / b;
}
```

### Assert Non-Null

```typescript
function assertDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error('Value is null or undefined');
  }
}

function getUser(id: number): User | null {
  // ...
}

function processUser(id: number) {
  const user = getUser(id);
  assertDefined(user);
  // user тепер точно User, не null
  console.log(user.name);
}
```

## Narrowing з Control Flow

TypeScript автоматично звужує типи:

```typescript
function example(value: string | number | null) {
  // value: string | number | null

  if (value === null) {
    return;
  }
  // value: string | number

  if (typeof value === 'string') {
    // value: string
    return value.toUpperCase();
  }
  // value: number
  return value.toFixed(2);
}
```

### Truthiness Narrowing

```typescript
function printName(name: string | null | undefined) {
  if (name) {
    // name: string (не null, не undefined, не "")
    console.log(name.toUpperCase());
  }
}

// Але обережно з числами!
function printCount(count: number | null) {
  if (count) {
    // Пропустить 0!
    console.log(count);
  }

  // Краще
  if (count !== null) {
    console.log(count);
  }
}
```

## Практичні завдання

::: tip Playground
[Відкрити завдання в Playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4FgBQyyIArgLYBGEATgDwAqAfMgLzIDeAUMsgPT-IAegG0AunQC+dOqEixEKTDgJEylGnSat2XXv0FDR4yVJlyFStZp3IANMl4ChIsZLoBuZi3aduvfiA)
:::

```typescript
// 1. Створи type guard для перевірки на Error
function isError(value: unknown): value is Error {
  return value instanceof Error;
}

// 2. Створи assertion function для non-empty array
function assertNonEmpty<T>(arr: T[]): asserts arr is [T, ...T[]] {
  if (arr.length === 0) {
    throw new Error('Array is empty');
  }
}

// 3. Створи type guard для API response
interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function isSuccess<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.status === 'success';
}

// 4. Використай discriminated union
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}
```

## Висновок

| Метод | Використання |
|-------|-------------|
| `typeof` | Примітивні типи |
| `instanceof` | Класи |
| `in` | Наявність властивості |
| Discriminated Union | Об'єкти з `kind`/`type` |
| `value is Type` | Custom type guards |
| `asserts value is Type` | Assertion functions |

Type guards — ключовий інструмент для безпечної роботи з union types!
