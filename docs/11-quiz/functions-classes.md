# Quiz: Функції та класи

Перевір свої знання функцій та класів TypeScript.

## Питання 1

Яка різниця між цими оголошеннями?

```typescript
function greet(name?: string) {}
function greet(name: string = "World") {}
```

<details>
<summary>Відповідь</summary>

- `name?: string` — параметр опціональний, може бути `undefined`
- `name: string = "World"` — параметр має значення за замовчуванням

```typescript
greet();          // Обидва працюють
greet(undefined); // Перший: undefined, Другий: "World"
```

</details>

---

## Питання 2

Що поверне ця функція?

```typescript
function test(): void {
  return undefined;
}
```

<details>
<summary>Відповідь</summary>

**undefined**

`void` дозволяє `return` без значення або `return undefined`. Не можна повертати інші значення.

</details>

---

## Питання 3

Чи скомпілюється?

```typescript
function process(a?: string, b: number) {}
```

<details>
<summary>Відповідь</summary>

**Ні, помилка!**

Опціональні параметри мають бути в кінці:

```typescript
function process(b: number, a?: string) {} // OK
```

</details>

---

## Питання 4

Який тип параметра `callback`?

```typescript
function forEach(arr: number[], callback: ???) {
  arr.forEach(callback);
}
```

<details>
<summary>Відповідь</summary>

```typescript
callback: (value: number, index: number, array: number[]) => void
```

Або спрощено:
```typescript
callback: (value: number) => void
```

</details>

---

## Питання 5

Що робить `this` параметр?

```typescript
function greet(this: User, greeting: string) {
  console.log(`${greeting}, ${this.name}`);
}
```

<details>
<summary>Відповідь</summary>

Фейковий параметр `this` вказує TypeScript, який тип очікується для `this`.

Він не впливає на виклик функції, тільки на перевірку типів:

```typescript
const user = { name: "Anna", greet };
user.greet("Hello"); // OK

greet("Hi"); // ❌ Помилка: this має бути User
```

</details>

---

## Питання 6

Яка різниця між `private` та `#`?

```typescript
class A {
  private x = 1;
}

class B {
  #y = 2;
}
```

<details>
<summary>Відповідь</summary>

- `private` — перевірка тільки на етапі компіляції (TypeScript)
- `#` — справжня приватність на рівні JavaScript (runtime)

```typescript
const a = new A();
(a as any).x; // Працює! Обхід через any

const b = new B();
(b as any).#y; // ❌ Синтаксична помилка!
```

</details>

---

## Питання 7

Чи можна створити екземпляр?

```typescript
abstract class Shape {
  abstract area(): number;
}

const shape = new Shape();
```

<details>
<summary>Відповідь</summary>

**Ні!**

Абстрактні класи не можна інстанціювати. Потрібно створити підклас:

```typescript
class Circle extends Shape {
  area() { return Math.PI * 10 * 10; }
}

const circle = new Circle(); // OK
```

</details>

---

## Питання 8

Що виведе код?

```typescript
class Counter {
  count = 0;

  increment = () => {
    this.count++;
  }
}

const counter = new Counter();
const fn = counter.increment;
fn();
console.log(counter.count);
```

<details>
<summary>Відповідь</summary>

**1**

Arrow function зберігає `this` з моменту створення. Тому `fn()` працює коректно.

Якби `increment` був звичайним методом, `this` був би `undefined`.

</details>

---

## Питання 9

Яка різниця між `implements` та `extends`?

```typescript
interface Printable {
  print(): void;
}

class A implements Printable {}
class B extends SomeClass {}
```

<details>
<summary>Відповідь</summary>

- `implements` — клас реалізує інтерфейс (контракт)
- `extends` — клас наслідує інший клас (код + типи)

```typescript
// implements — потрібно реалізувати все самому
class A implements Printable {
  print() { console.log("A"); }
}

// extends — наслідує методи батьківського класу
class B extends Parent {
  // Має доступ до методів Parent
}
```

</details>

---

## Питання 10

Що означає `readonly` в конструкторі?

```typescript
class User {
  constructor(public readonly id: number) {}
}
```

<details>
<summary>Відповідь</summary>

- `public` — властивість публічна
- `readonly` — не можна змінювати після створення

```typescript
const user = new User(1);
console.log(user.id); // 1
user.id = 2; // ❌ Помилка: readonly
```

</details>

---

## Питання 11

Чи коректний код?

```typescript
class Parent {
  protected value = 10;
}

class Child extends Parent {
  getValue() {
    return this.value;
  }
}

const child = new Child();
console.log(child.value);
```

<details>
<summary>Відповідь</summary>

**Ні, остання строка — помилка!**

`protected` доступний в класі та підкласах, але не ззовні:

```typescript
child.getValue(); // OK — через метод
child.value;      // ❌ Помилка — напряму
```

</details>

---

## Питання 12

Що таке перевантаження функцій?

```typescript
function process(x: string): string;
function process(x: number): number;
function process(x: string | number): string | number {
  return x;
}
```

<details>
<summary>Відповідь</summary>

**Function overloading** — декілька сигнатур для різних типів параметрів.

TypeScript обирає правильну сигнатуру:

```typescript
const a = process("hello"); // string
const b = process(42);      // number
```

Реалізація (остання функція) не видима ззовні.

</details>

---

## Підсумок

**Ключові концепції:**

| Концепт | Опис |
|---------|------|
| Optional params | `param?: type` |
| Default params | `param = value` |
| Rest params | `...args: type[]` |
| void | Функція нічого не повертає |
| never | Функція не завершується |
| public/private/protected | Модифікатори доступу |
| readonly | Не можна змінювати |
| abstract | Не можна інстанціювати |
| implements | Реалізація інтерфейсу |
| extends | Наслідування класу |

Якщо відповів правильно на 10+ питань — функції та класи освоєно!
