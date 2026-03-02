# Quiz: Базові типи

Перевір свої знання базових типів TypeScript.

## Питання 1

Який тип має змінна `x`?

```typescript
let x = 42;
```

<details>
<summary>Відповідь</summary>

**number**

TypeScript автоматично виводить тип з присвоєного значення (type inference).

</details>

---

## Питання 2

Що виведе цей код?

```typescript
let value: unknown = "hello";
console.log(value.toUpperCase());
```

<details>
<summary>Відповідь</summary>

**Помилка компіляції!**

`unknown` вимагає перевірки типу перед використанням:

```typescript
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // OK
}
```

</details>

---

## Питання 3

Яка різниця між `any` та `unknown`?

<details>
<summary>Відповідь</summary>

- **any** — вимикає перевірку типів, можна робити будь-що
- **unknown** — безпечний, вимагає перевірки типу перед використанням

```typescript
let a: any = "hello";
a.foo(); // OK (але впаде в runtime)

let b: unknown = "hello";
b.foo(); // ❌ Помилка компіляції
```

</details>

---

## Питання 4

Який тип поверне ця функція?

```typescript
function getValue() {
  return null;
}
```

<details>
<summary>Відповідь</summary>

**null**

Без явної вказівки TypeScript виведе тип з `return` виразу.

</details>

---

## Питання 5

Чи скомпілюється цей код?

```typescript
let tuple: [string, number] = ["hello", 42, true];
```

<details>
<summary>Відповідь</summary>

**Ні, помилка!**

Кортеж `[string, number]` очікує рівно 2 елементи. Третій елемент `true` зайвий.

</details>

---

## Питання 6

Що таке literal type?

```typescript
let direction: "left" | "right" = "left";
```

<details>
<summary>Відповідь</summary>

**Literal type** — тип, що приймає тільки конкретні значення.

`direction` може бути тільки `"left"` або `"right"`, ніщо інше.

```typescript
direction = "up"; // ❌ Помилка
```

</details>

---

## Питання 7

Яка різниця між цими оголошеннями?

```typescript
const arr1: number[] = [1, 2, 3];
const arr2: Array<number> = [1, 2, 3];
```

<details>
<summary>Відповідь</summary>

**Немає різниці!**

Обидва синтаксиси еквівалентні. `number[]` — скорочена форма `Array<number>`.

</details>

---

## Питання 8

Що поверне `typeof` для enum?

```typescript
enum Color {
  Red,
  Green,
  Blue
}

console.log(typeof Color);
console.log(typeof Color.Red);
```

<details>
<summary>Відповідь</summary>

```
"object"
"number"
```

Enum компілюється в об'єкт. Значення без ініціалізації — числа (0, 1, 2...).

</details>

---

## Питання 9

Чи можна присвоїти `null` змінній типу `string`?

```typescript
let name: string = null;
```

<details>
<summary>Відповідь</summary>

**Залежить від налаштувань!**

- З `strictNullChecks: false` — так
- З `strictNullChecks: true` — ні, потрібно `string | null`

```typescript
let name: string | null = null; // OK завжди
```

</details>

---

## Питання 10

Що таке `never`?

```typescript
function fail(): never {
  throw new Error("Error");
}
```

<details>
<summary>Відповідь</summary>

**never** — тип для функцій, що ніколи не повертаються:
- Кидають помилку
- Мають нескінченний цикл

Також використовується в exhaustive checks.

</details>

---

## Питання 11

Який тип `result`?

```typescript
const result = [1, "two", 3];
```

<details>
<summary>Відповідь</summary>

**(string | number)[]**

TypeScript виводить найширший тип, що охоплює всі елементи.

</details>

---

## Питання 12

Чи правильний цей код?

```typescript
const config = {
  port: 3000,
  host: "localhost"
} as const;

config.port = 8080;
```

<details>
<summary>Відповідь</summary>

**Ні, помилка!**

`as const` робить всі властивості `readonly`. Змінити `port` не можна.

```typescript
// config.port має тип 3000 (literal), не number
```

</details>

---

## Підсумок

**Основні концепції:**

| Тип | Опис |
|-----|------|
| `string`, `number`, `boolean` | Примітиви |
| `null`, `undefined` | Відсутність значення |
| `any` | Вимикає типізацію |
| `unknown` | Безпечна альтернатива any |
| `never` | Ніколи не повертається |
| `void` | Нічого не повертає |
| Literal types | Конкретні значення |
| Union types | `A \| B` |
| Tuple | Масив фіксованої довжини |

Якщо відповів правильно на 10+ питань — базові типи освоєно!
