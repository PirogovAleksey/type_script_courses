# Type Aliases

Type alias створює нове ім'я для типу.

## Базовий синтаксис

```typescript
type ID = number;
type Name = string;
type Callback = () => void;

let userId: ID = 42;
let userName: Name = 'Anna';
let onComplete: Callback = () => console.log('Done!');
```

## Type alias для об'єктів

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: 'Anna',
  email: 'anna@example.com'
};
```

## Union Types

Один з головних випадків використання type:

```typescript
type Status = 'pending' | 'active' | 'completed';
type Result = 'success' | 'error';
type ID = string | number;

let status: Status = 'active';
let userId: ID = 123;
userId = 'abc-123'; // Теж OK
```

### Discriminated Unions

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'rectangle'; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}
```

## Intersection Types

Об'єднання типів:

```typescript
type HasName = { name: string };
type HasAge = { age: number };
type HasEmail = { email: string };

type Person = HasName & HasAge;
type User = Person & HasEmail;

const user: User = {
  name: 'Anna',
  age: 28,
  email: 'anna@example.com'
};
```

## Type для функцій

```typescript
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

type AsyncFunction<T> = () => Promise<T>;
type EventHandler = (event: Event) => void;
```

## Type для масивів та кортежів

```typescript
type StringArray = string[];
type NumberArray = Array<number>;
type Coordinates = [number, number];
type RGB = [red: number, green: number, blue: number];

const colors: StringArray = ['red', 'green', 'blue'];
const point: Coordinates = [10, 20];
const red: RGB = [255, 0, 0];
```

## Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Практичний приклад
type ArrayElement<T> = T extends (infer E)[] ? E : T;

type A = ArrayElement<string[]>;  // string
type B = ArrayElement<number[]>;  // number
type C = ArrayElement<boolean>;   // boolean
```

## Mapped Types

Трансформація типів:

```typescript
type User = {
  id: number;
  name: string;
  email: string;
};

// Всі властивості опціональні
type PartialUser = {
  [K in keyof User]?: User[K];
};

// Всі властивості readonly
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

// Вбудовані утиліти роблять те саме:
type PartialUser2 = Partial<User>;
type ReadonlyUser2 = Readonly<User>;
```

## Template Literal Types

```typescript
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts';
type ApiRoute = `${HttpMethod} ${Endpoint}`;
// 'GET /users' | 'GET /posts' | 'POST /users' | ...
```

## Recursive Types

```typescript
type TreeNode = {
  value: string;
  children?: TreeNode[];
};

const tree: TreeNode = {
  value: 'root',
  children: [
    { value: 'child1' },
    {
      value: 'child2',
      children: [
        { value: 'grandchild' }
      ]
    }
  ]
};

// JSON type
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
```

## Utility Types

TypeScript надає вбудовані утиліти:

```typescript
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// Partial — всі опціональні
type PartialUser = Partial<User>;

// Required — всі обов'язкові
type RequiredUser = Required<User>;

// Readonly — всі readonly
type ReadonlyUser = Readonly<User>;

// Pick — вибрати властивості
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit — виключити властивості
type UserWithoutEmail = Omit<User, 'email'>;

// Record — ключ-значення
type UserRoles = Record<string, 'admin' | 'user' | 'guest'>;
```

### Більше утиліт

```typescript
// Exclude — виключити з union
type Numbers = 1 | 2 | 3 | 4 | 5;
type SmallNumbers = Exclude<Numbers, 4 | 5>; // 1 | 2 | 3

// Extract — залишити з union
type BigNumbers = Extract<Numbers, 4 | 5>; // 4 | 5

// NonNullable — виключити null/undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// ReturnType — тип повернення функції
function getUser() {
  return { id: 1, name: 'Anna' };
}
type User = ReturnType<typeof getUser>;

// Parameters — типи параметрів функції
function greet(name: string, age: number) {}
type GreetParams = Parameters<typeof greet>; // [string, number]
```

## Практичні приклади

### API Types

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiRequest<T = unknown> = {
  method: HttpMethod;
  url: string;
  body?: T;
  headers?: Record<string, string>;
};

type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

### Form Types

```typescript
type FormField<T> = {
  value: T;
  error?: string;
  touched: boolean;
};

type LoginForm = {
  email: FormField<string>;
  password: FormField<string>;
  rememberMe: FormField<boolean>;
};
```

### State Machine

```typescript
type LoadingState = { status: 'loading' };
type SuccessState<T> = { status: 'success'; data: T };
type ErrorState = { status: 'error'; error: Error };

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return state.data;
    case 'error':
      return state.error.message;
  }
}
```

## Практичне завдання

```typescript
// 1. Створи union type для статусу замовлення
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

// 2. Створи type для Result pattern
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// 3. Створи mapped type для nullable властивостей
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};
```

## Висновок

Type aliases дуже гнучкі: підтримують union, intersection, conditional та mapped types. У наступному уроці порівняємо interface та type.
