# Quiz: Generics

Перевір свої знання Generics у TypeScript.

## Питання 1

Що виведе цей код?

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const result = identity<string>("hello");
console.log(typeof result);
```

<details>
<summary>Відповідь</summary>

**"string"**

Generic `T` стає `string` при виклику. `result` має тип `string`.

</details>

---

## Питання 2

Чи потрібно вказувати `<string>` явно?

```typescript
const result = identity<string>("hello");
// vs
const result = identity("hello");
```

<details>
<summary>Відповідь</summary>

**Ні, TypeScript виведе автоматично.**

Type inference визначить `T` як `string` з аргументу `"hello"`.

Явно вказуємо тільки коли:
- Потрібен конкретний тип
- Автовиведення не працює

</details>

---

## Питання 3

Чи скомпілюється?

```typescript
function getLength<T>(arg: T): number {
  return arg.length;
}
```

<details>
<summary>Відповідь</summary>

**Ні, помилка!**

`T` може бути будь-яким типом, не обов'язково з `.length`.

Потрібен constraint:

```typescript
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

</details>

---

## Питання 4

Що означає `<T extends U>`?

```typescript
function copyFields<T extends U, U>(target: T, source: U): T {
  return { ...target, ...source };
}
```

<details>
<summary>Відповідь</summary>

`T extends U` означає, що `T` має бути підтипом `U`.

У цьому прикладі:
- `T` має всі властивості `U` (і можливо більше)
- `source` може мати тільки властивості з `U`

</details>

---

## Питання 5

Який тип `result`?

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const result = first([1, 2, 3]);
```

<details>
<summary>Відповідь</summary>

**number | undefined**

- `T` виведено як `number` (з масиву чисел)
- Функція повертає `T | undefined`
- Отже `result` має тип `number | undefined`

</details>

---

## Питання 6

Чи скомпілюється?

```typescript
interface Box<T = string> {
  value: T;
}

const box: Box = { value: 42 };
```

<details>
<summary>Відповідь</summary>

**Ні, помилка!**

`T = string` — значення за замовчуванням.
`Box` без параметра означає `Box<string>`.
`42` — number, не string.

```typescript
const box: Box = { value: "hello" };     // OK
const box: Box<number> = { value: 42 };  // OK
```

</details>

---

## Питання 7

Що робить `keyof`?

```typescript
interface User {
  name: string;
  age: number;
}

type UserKeys = keyof User;
```

<details>
<summary>Відповідь</summary>

`keyof` повертає union ключів об'єкта:

```typescript
type UserKeys = "name" | "age";
```

Корисно для типобезпечного доступу до властивостей:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

</details>

---

## Питання 8

Яка різниця?

```typescript
type A = Array<string | number>;
type B = Array<string> | Array<number>;
```

<details>
<summary>Відповідь</summary>

- `A` — масив, де кожен елемент `string` АБО `number` (змішаний)
- `B` — масив тільки `string` АБО масив тільки `number`

```typescript
const a: A = [1, "two", 3];     // OK
const b: B = [1, "two", 3];     // ❌ Помилка!
const b2: B = [1, 2, 3];        // OK
const b3: B = ["a", "b", "c"];  // OK
```

</details>

---

## Питання 9

Що таке Mapped Type?

```typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

<details>
<summary>Відповідь</summary>

**Mapped Type** трансформує всі властивості типу.

- `[K in keyof T]` — ітерація по всіх ключах `T`
- `T[K]` — тип значення для ключа `K`
- `readonly` — модифікатор

```typescript
interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number; }
```

</details>

---

## Питання 10

Що поверне `ReturnType`?

```typescript
function createUser() {
  return { name: "Anna", age: 25 };
}

type User = ReturnType<typeof createUser>;
```

<details>
<summary>Відповідь</summary>

```typescript
type User = {
  name: string;
  age: number;
}
```

`ReturnType<T>` витягує тип повернення функції `T`.

</details>

---

## Питання 11

Чи коректний код?

```typescript
class Container<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  static create<U>(value: U): Container<U> {
    return new Container(value);
  }
}
```

<details>
<summary>Відповідь</summary>

**Так, коректний!**

Статичні методи мають власні generic параметри (`U`), окремі від класу (`T`).

```typescript
const container = Container.create("hello");
// Container<string>
```

</details>

---

## Питання 12

Що таке Conditional Type?

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;
type B = IsString<42>;
```

<details>
<summary>Відповідь</summary>

**Conditional Type** — тип, що залежить від умови.

```typescript
type A = true;   // "hello" extends string
type B = false;  // 42 не extends string
```

Синтаксис: `T extends U ? X : Y`
- Якщо `T` підтип `U`, результат `X`
- Інакше результат `Y`

</details>

---

## Питання 13

Що робить `infer`?

```typescript
type ElementType<T> = T extends (infer E)[] ? E : T;

type A = ElementType<string[]>;
type B = ElementType<number>;
```

<details>
<summary>Відповідь</summary>

`infer` витягує тип з умови:

```typescript
type A = string;  // E виведено як string
type B = number;  // T не масив, повертає T
```

`infer E` створює змінну типу `E`, яку TypeScript виводить автоматично.

</details>

---

## Підсумок

**Ключові концепції:**

| Концепт | Опис |
|---------|------|
| `<T>` | Параметр типу |
| `T extends U` | Обмеження типу |
| `keyof T` | Ключі об'єкта |
| `T[K]` | Тип властивості |
| Mapped Types | `{ [K in keyof T]: ... }` |
| Conditional Types | `T extends U ? X : Y` |
| `infer` | Виведення типу в умові |
| `Partial<T>` | Всі властивості опціональні |
| `Required<T>` | Всі властивості обов'язкові |
| `Pick<T, K>` | Вибрати властивості |
| `Omit<T, K>` | Виключити властивості |
| `ReturnType<T>` | Тип повернення функції |

Якщо відповів правильно на 10+ питань — Generics освоєно!
