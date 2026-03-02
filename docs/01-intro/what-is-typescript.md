# Що таке TypeScript

TypeScript — це мова програмування, створена Microsoft у 2012 році. Вона є **надбудовою над JavaScript**, що додає статичну типізацію.

## Навіщо потрібен TypeScript?

### 1. Виявлення помилок на етапі розробки

JavaScript:
```javascript
function greet(name) {
  return 'Hello, ' + name.toUpperCase();
}

greet(42); // Помилка під час виконання!
```

TypeScript:
```typescript
function greet(name: string) {
  return 'Hello, ' + name.toUpperCase();
}

greet(42); // ❌ Помилка ще в редакторі!
```

### 2. Краща автопідказка в IDE

Завдяки типам, твій редактор знає, які методи та властивості доступні:

```typescript
const user = {
  name: 'John',
  age: 25
};

user. // IDE підкаже: name, age
```

### 3. Самодокументований код

Типи слугують документацією:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function createUser(data: User): User {
  // Одразу зрозуміло, що приймає і повертає функція
}
```

## TypeScript vs JavaScript

| Аспект | JavaScript | TypeScript |
|--------|------------|------------|
| Типізація | Динамічна | Статична |
| Помилки | Під час виконання | Під час компіляції |
| Компіляція | Не потрібна | Потрібна (в JS) |
| Підтримка IDE | Базова | Розширена |

## Як працює TypeScript?

```
TypeScript (.ts) → Компілятор (tsc) → JavaScript (.js) → Браузер/Node.js
```

TypeScript код компілюється в звичайний JavaScript, який виконується в браузері або Node.js.

## Перший приклад

```typescript
// Оголошення змінної з типом
let message: string = 'Hello, TypeScript!';

// Функція з типізованими параметрами
function add(a: number, b: number): number {
  return a + b;
}

// Інтерфейс для об'єкта
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: 'Anna',
  age: 28
};

console.log(message);
console.log(add(5, 3));
console.log(person.name);
```

## Висновок

TypeScript допомагає писати надійніший код, виявляючи помилки ще до запуску програми. У наступному уроці налаштуємо середовище для роботи з TypeScript.
