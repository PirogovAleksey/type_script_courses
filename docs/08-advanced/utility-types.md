# Utility Types

TypeScript надає вбудовані типи-утиліти для трансформації типів.

::: tip Playground
[Відкрити в TypeScript Playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4ChnIhwC2EAXMumFKAOYDcuBRJZAHpPQgCuAtgCMIUAL4ECxUhSq0GTNgAoAlBQFQAvFOTosuAsTJVaDJi3Zde-QSLFce85Wrk0A9I+QBeZAG0AugG5cIA)
:::

## Partial\<T\>

Робить всі властивості опціональними:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// {
//   id?: number;
//   name?: string;
//   email?: string;
// }

// Корисно для оновлення
function updateUser(id: number, updates: Partial<User>) {
  // Можна передати тільки поля, що змінюються
}

updateUser(1, { name: 'New Name' }); // OK
```

## Required\<T\>

Робить всі властивості обов'язковими:

```typescript
interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

type RequiredConfig = Required<Config>;
// {
//   host: string;
//   port: number;
//   debug: boolean;
// }

function initApp(config: RequiredConfig) {
  // Всі поля гарантовано присутні
}
```

## Readonly\<T\>

Робить всі властивості readonly:

```typescript
interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;

const user: ReadonlyUser = { id: 1, name: 'Anna' };
// user.name = 'John'; // ❌ Помилка: readonly
```

## Pick\<T, K\>

Вибирає тільки вказані властивості:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

type UserCredentials = Pick<User, 'email' | 'password'>;
// { email: string; password: string; }
```

## Omit\<T, K\>

Виключає вказані властивості:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;
// { id: number; name: string; email: string; }

type CreateUserDto = Omit<User, 'id'>;
// { name: string; email: string; password: string; }
```

## Record\<K, T\>

Створює об'єкт з ключами K та значеннями T:

```typescript
type Role = 'admin' | 'user' | 'guest';

type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
};

// Для динамічних ключів
type StringMap = Record<string, number>;
const scores: StringMap = {
  alice: 100,
  bob: 85
};
```

## Exclude\<T, U\>

Виключає типи з union:

```typescript
type AllTypes = string | number | boolean | null | undefined;

type NonNullTypes = Exclude<AllTypes, null | undefined>;
// string | number | boolean

type Primitives = Exclude<AllTypes, boolean>;
// string | number | null | undefined
```

## Extract\<T, U\>

Витягує типи з union:

```typescript
type AllTypes = string | number | boolean | null;

type StringOrNumber = Extract<AllTypes, string | number>;
// string | number

type OnlyString = Extract<AllTypes, string>;
// string
```

## NonNullable\<T\>

Виключає null та undefined:

```typescript
type MaybeString = string | null | undefined;

type DefiniteString = NonNullable<MaybeString>;
// string

function process(value: MaybeString) {
  const safe: NonNullable<typeof value> = value!;
  // або
  if (value != null) {
    const safe: NonNullable<typeof value> = value;
  }
}
```

## ReturnType\<T\>

Витягує тип повернення функції:

```typescript
function createUser() {
  return {
    id: 1,
    name: 'Anna',
    createdAt: new Date()
  };
}

type User = ReturnType<typeof createUser>;
// { id: number; name: string; createdAt: Date; }

// Для async функцій
async function fetchUser() {
  return { id: 1, name: 'Anna' };
}

type FetchResult = ReturnType<typeof fetchUser>;
// Promise<{ id: number; name: string; }>

type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string; }
```

## Parameters\<T\>

Витягує типи параметрів функції:

```typescript
function greet(name: string, age: number): string {
  return `Hello, ${name}! You are ${age} years old.`;
}

type GreetParams = Parameters<typeof greet>;
// [string, number]

// Деструктуризація
type NameParam = Parameters<typeof greet>[0]; // string
type AgeParam = Parameters<typeof greet>[1];  // number
```

## ConstructorParameters\<T\>

Витягує типи параметрів конструктора:

```typescript
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
// [string, number]
```

## InstanceType\<T\>

Витягує тип екземпляра класу:

```typescript
class User {
  constructor(public name: string) {}
  greet() {
    return `Hello, ${this.name}`;
  }
}

type UserInstance = InstanceType<typeof User>;
// User

function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

const user = createInstance(User, 'Anna');
```

## Awaited\<T\>

Розгортає Promise:

```typescript
type A = Awaited<Promise<string>>;
// string

type B = Awaited<Promise<Promise<number>>>;
// number (рекурсивно розгортає)

type C = Awaited<boolean | Promise<string>>;
// boolean | string
```

## Комбінування утиліт

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Публічний профіль (без password)
type PublicProfile = Readonly<Omit<User, 'password'>>;

// Форма реєстрації
type RegisterForm = Pick<User, 'name' | 'email' | 'password'>;

// Форма оновлення (все опціонально, без id)
type UpdateForm = Partial<Omit<User, 'id' | 'createdAt'>>;

// Адмін користувач
type AdminUser = User & { role: 'admin' };
```

## Практичні завдання

::: tip Playground
[Відкрити завдання в Playground](https://www.typescriptlang.org/play?#code/JYOwLgpgTgZghgYwgAgKoGdrIN4FgBQyyA)
:::

```typescript
// 1. Створи тип для API відповіді
interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

type SuccessResponse<T> = Required<Pick<ApiResponse<T>, 'data'>> &
  { error: null; loading: false };

// 2. Створи тип DeepReadonly
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

// 3. Створи тип Mutable (протилежність Readonly)
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// 4. Створи тип Optional (вибіркова опціональність)
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithOptionalEmail = Optional<User, 'email'>;
// { id: number; name: string; email?: string; }
```

## Висновок

| Утиліта | Опис |
|---------|------|
| `Partial<T>` | Всі властивості опціональні |
| `Required<T>` | Всі властивості обов'язкові |
| `Readonly<T>` | Всі властивості readonly |
| `Pick<T, K>` | Вибрати властивості |
| `Omit<T, K>` | Виключити властивості |
| `Record<K, T>` | Об'єкт з ключами K |
| `Exclude<T, U>` | Виключити з union |
| `Extract<T, U>` | Витягти з union |
| `NonNullable<T>` | Виключити null/undefined |
| `ReturnType<T>` | Тип повернення функції |
| `Parameters<T>` | Типи параметрів |
| `Awaited<T>` | Розгорнути Promise |
