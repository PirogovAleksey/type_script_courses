# Namespaces

Namespaces — спосіб організації коду в TypeScript. Сьогодні переважно використовують ES модулі.

::: warning Застаріло
Namespaces рідко використовуються в сучасному TypeScript. Віддавай перевагу ES модулям (`import`/`export`). Цей урок корисний для розуміння legacy коду.
:::

## Базовий синтаксис

```typescript
namespace Utils {
  export function log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }

  export function error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }

  // Не експортовано — приватне
  function formatDate(): string {
    return new Date().toISOString();
  }
}

// Використання
Utils.log('Hello');
Utils.error('Something went wrong');
```

## Вкладені Namespaces

```typescript
namespace App {
  export namespace Utils {
    export function log(msg: string): void {
      console.log(msg);
    }
  }

  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
  }

  export namespace Services {
    export class UserService {
      getUser(id: number): Models.User {
        return { id, name: 'Anna' };
      }
    }
  }
}

// Використання
const user: App.Models.User = { id: 1, name: 'Anna' };
App.Utils.log('User created');
const service = new App.Services.UserService();
```

## Аліаси з import

```typescript
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

// Аліас для зручності
import Polygons = Shapes.Polygons;

const triangle = new Polygons.Triangle();
const square = new Polygons.Square();
```

## Розділення по файлах

```typescript
// shapes.ts
namespace Shapes {
  export class Circle {
    constructor(public radius: number) {}

    area(): number {
      return Math.PI * this.radius ** 2;
    }
  }
}

// rectangles.ts
/// <reference path="shapes.ts" />

namespace Shapes {
  export class Rectangle {
    constructor(public width: number, public height: number) {}

    area(): number {
      return this.width * this.height;
    }
  }
}

// app.ts
/// <reference path="shapes.ts" />
/// <reference path="rectangles.ts" />

const circle = new Shapes.Circle(5);
const rect = new Shapes.Rectangle(10, 20);
```

## Namespace vs Module

### Namespace (старий спосіб)

```typescript
// utils.ts
namespace Utils {
  export function log(msg: string) {
    console.log(msg);
  }
}

// app.ts
/// <reference path="utils.ts" />
Utils.log('Hello');
```

### ES Module (сучасний спосіб)

```typescript
// utils.ts
export function log(msg: string) {
  console.log(msg);
}

// app.ts
import { log } from './utils';
log('Hello');
```

### Порівняння

| Аспект | Namespace | ES Module |
|--------|-----------|-----------|
| Синтаксис | `namespace X {}` | `import`/`export` |
| Файлова структура | Об'єднання файлів | Кожен файл — модуль |
| Підтримка bundlers | Обмежена | Повна |
| Tree shaking | Ні | Так |
| Сучасність | Legacy | Рекомендовано |

## Коли використовувати Namespaces

### 1. Declaration Files

```typescript
// lodash.d.ts
declare namespace _ {
  function chunk<T>(arr: T[], size: number): T[][];
  function uniq<T>(arr: T[]): T[];
}
```

### 2. Глобальні типи

```typescript
// globals.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    API_URL: string;
  }
}
```

### 3. Enum-like константи

```typescript
namespace HttpStatus {
  export const OK = 200;
  export const NOT_FOUND = 404;
  export const SERVER_ERROR = 500;

  export type Code = typeof OK | typeof NOT_FOUND | typeof SERVER_ERROR;
}

function handleResponse(status: HttpStatus.Code) {
  if (status === HttpStatus.OK) {
    console.log('Success');
  }
}
```

## Namespace Merging

Namespaces можна об'єднувати:

```typescript
namespace Animal {
  export class Dog {
    bark() { console.log('Woof!'); }
  }
}

namespace Animal {
  export class Cat {
    meow() { console.log('Meow!'); }
  }
}

// Animal тепер має Dog і Cat
const dog = new Animal.Dog();
const cat = new Animal.Cat();
```

### Об'єднання з класами

```typescript
class Album {
  label = 'Default';
}

namespace Album {
  export class Track {
    constructor(public name: string) {}
  }
}

const album = new Album();
const track = new Album.Track('Song');
```

### Об'єднання з функціями

```typescript
function buildLabel(name: string): string {
  return `${buildLabel.prefix}${name}${buildLabel.suffix}`;
}

namespace buildLabel {
  export let prefix = '>>> ';
  export let suffix = ' <<<';
}

console.log(buildLabel('Hello')); // ">>> Hello <<<"
```

## Міграція на ES Modules

### До (Namespace)

```typescript
namespace MyApp {
  export namespace Utils {
    export function log(msg: string) {
      console.log(msg);
    }
  }

  export namespace Models {
    export interface User {
      id: number;
      name: string;
    }
  }
}
```

### Після (ES Modules)

```typescript
// utils/log.ts
export function log(msg: string) {
  console.log(msg);
}

// models/user.ts
export interface User {
  id: number;
  name: string;
}

// index.ts
export * from './utils/log';
export * from './models/user';
```

## Практичні завдання

```typescript
// 1. Перетвори namespace на ES modules

// До:
namespace Validators {
  export function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  export function isPhone(value: string): boolean {
    return /^\+?[\d\s-]+$/.test(value);
  }
}

// Після:
// validators/email.ts
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// validators/phone.ts
export function isPhone(value: string): boolean {
  return /^\+?[\d\s-]+$/.test(value);
}

// validators/index.ts
export { isEmail } from './email';
export { isPhone } from './phone';


// 2. Створи namespace для констант (валідний use case)
namespace Config {
  export const API_URL = 'https://api.example.com';
  export const TIMEOUT = 5000;
  export const MAX_RETRIES = 3;

  export namespace Endpoints {
    export const USERS = '/users';
    export const POSTS = '/posts';
  }
}
```

## Висновок

| Ситуація | Рекомендація |
|----------|-------------|
| Новий проєкт | ES Modules |
| Legacy код | Поступова міграція |
| Declaration files | Namespace OK |
| Глобальні типи | Namespace OK |
| NPM пакет | ES Modules |

**Правило**: Якщо можеш використати `import`/`export` — використовуй. Namespace тільки для специфічних випадків (declaration files, глобальні типи).
