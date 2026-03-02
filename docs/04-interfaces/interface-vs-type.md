# Interface vs Type

Обидва підходи схожі, але мають важливі відмінності.

## Спільні можливості

### Опис об'єктів

```typescript
// Interface
interface UserInterface {
  id: number;
  name: string;
}

// Type
type UserType = {
  id: number;
  name: string;
};

// Обидва працюють однаково
const user1: UserInterface = { id: 1, name: 'Anna' };
const user2: UserType = { id: 1, name: 'Anna' };
```

### Опис функцій

```typescript
// Interface
interface GreetFunction {
  (name: string): string;
}

// Type
type GreetType = (name: string) => string;

const greet1: GreetFunction = (name) => `Hello, ${name}`;
const greet2: GreetType = (name) => `Hello, ${name}`;
```

### Розширення

```typescript
// Interface extends interface
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Type extends type (через &)
type AnimalType = { name: string };
type DogType = AnimalType & { breed: string };

// Interface extends type
interface Cat extends AnimalType {
  color: string;
}

// Type extends interface (через &)
type Bird = Animal & { wingspan: number };
```

## Відмінності

### 1. Declaration Merging

**Interface** підтримує об'єднання:

```typescript
interface User {
  name: string;
}

interface User {
  email: string;
}

// Результат: User має name та email
const user: User = {
  name: 'Anna',
  email: 'anna@example.com'
};
```

**Type** не підтримує:

```typescript
type User = { name: string };
type User = { email: string }; // ❌ Помилка: Duplicate identifier
```

### 2. Union та Intersection Types

**Type** підтримує union:

```typescript
type Status = 'active' | 'inactive';
type ID = string | number;
type Result = Success | Error;
```

**Interface** не може бути union:

```typescript
// ❌ Неможливо
interface Status = 'active' | 'inactive';
```

### 3. Primitive Types

**Type** може працювати з примітивами:

```typescript
type Name = string;
type Age = number;
type ID = string | number;
```

**Interface** тільки для об'єктів:

```typescript
// ❌ Неможливо
interface Name extends string {}
```

### 4. Mapped Types

**Type** підтримує mapped types:

```typescript
type User = { name: string; age: number };
type ReadonlyUser = { readonly [K in keyof User]: User[K] };
```

**Interface** не може:

```typescript
// ❌ Синтаксис не працює з interface
interface ReadonlyUser {
  readonly [K in keyof User]: User[K];
}
```

### 5. Conditional Types

Тільки **type**:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<42>;      // false
```

### 6. Computed Properties

**Type** підтримує:

```typescript
type Keys = 'firstName' | 'lastName';
type Person = { [K in Keys]: string };
// { firstName: string; lastName: string }
```

## Коли що використовувати?

### Використовуй Interface:

```typescript
// 1. Для опису API об'єктів
interface User {
  id: number;
  name: string;
}

// 2. Для класів
interface Repository<T> {
  find(id: number): T | null;
  save(item: T): void;
}

class UserRepository implements Repository<User> {
  find(id: number) { /* ... */ }
  save(user: User) { /* ... */ }
}

// 3. Для публічних API бібліотек (declaration merging)
interface Window {
  myCustomProperty: string;
}
```

### Використовуй Type:

```typescript
// 1. Union types
type Status = 'pending' | 'active' | 'completed';
type Response = Success | Error;

// 2. Складні типи
type Callback<T> = (data: T) => void;
type AsyncFunction<T> = () => Promise<T>;

// 3. Mapped та conditional types
type Partial<T> = { [K in keyof T]?: T[K] };
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 4. Tuple types
type Coordinates = [number, number];
type RGB = [number, number, number];

// 5. Примітивні аліаси
type ID = string | number;
type Timestamp = number;
```

## Практичні рекомендації

### Консистентність

Обери один підхід для проєкту:

```typescript
// Варіант 1: Interface для об'єктів, Type для решти
interface User { /* ... */ }
type Status = 'active' | 'inactive';

// Варіант 2: Завжди Type
type User = { /* ... */ };
type Status = 'active' | 'inactive';
```

### Гібридний підхід (рекомендований)

```typescript
// Interface — для "сутностей" (entities)
interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

// Type — для utilities, unions, computed
type UserStatus = 'active' | 'inactive' | 'banned';
type UserWithStatus = User & { status: UserStatus };
type PartialUser = Partial<User>;
type UserKeys = keyof User;
```

## Порівняльна таблиця

| Можливість | Interface | Type |
|------------|-----------|------|
| Опис об'єктів | ✅ | ✅ |
| Опис функцій | ✅ | ✅ |
| Extends/Intersection | ✅ | ✅ |
| Implements в класах | ✅ | ✅ |
| Declaration merging | ✅ | ❌ |
| Union types | ❌ | ✅ |
| Примітивні типи | ❌ | ✅ |
| Mapped types | ❌ | ✅ |
| Conditional types | ❌ | ✅ |
| Tuple types | ❌ | ✅ |

## Практичне завдання

```typescript
// Визнач, що краще — interface чи type:

// 1. Опис користувача з методами
interface User {
  id: number;
  name: string;
  greet(): string;
}

// 2. Статус замовлення
type OrderStatus = 'pending' | 'shipped' | 'delivered';

// 3. Результат операції
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 4. Props для компонента
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// 5. Тип для ID
type ID = string | number;
```

## Висновок

- **Interface** — для опису форми об'єктів, класів, публічних API
- **Type** — для union types, mapped types, conditional types, примітивів

У більшості випадків обидва підходи взаємозамінні. Головне — бути консистентним у проєкті.
