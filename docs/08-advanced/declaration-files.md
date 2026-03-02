# Declaration Files (.d.ts)

Declaration files описують типи для JavaScript бібліотек.

::: tip Playground
[Відкрити в TypeScript Playground](https://www.typescriptlang.org/play?#code/PTAEBUAsEsGdQMYBsCmoBOBXALqAhgE6gC2ANgOYB0AZk6AN4BQooAHpAN6g6gByo-UACb0AxqGoA+UAF5QAIgCiAGVAAVLTv0BRPQAUASgEFjAKQBCWgJIBhAKIBxJUoAKAbQC6oACIBpAMoBVAGUAWlAAfQBtAF0AfjcoVQ8ACUlZBRNVUGSNLSMTMws-KxsHJzdJaQ8I+MSkqCT0zOycvPh7UvLKmsVqZJMU5rb2iuKzXINjUzybAN6Z-sKJodnxxrU6iN0l5ayUtLb8kxC+gZLBoqGRlTHShaq53o3tnd3bpaPj07fQ6+xPp8th8vi9vpD5gCLqAjgkOEDIcC4aDEcjXuiPuCdnj9IA)
:::

## Що таке .d.ts файли?

Declaration files містять тільки типи, без реалізації:

```typescript
// math.d.ts
declare function add(a: number, b: number): number;
declare function multiply(a: number, b: number): number;
declare const PI: number;
```

Вони потрібні для:
- Типізації JavaScript бібліотек
- Опису глобальних змінних
- Публікації типів для npm пакетів

## Автоматична генерація

```bash
# В tsconfig.json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

Компілятор створить .d.ts файли автоматично:

```typescript
// src/utils.ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// types/utils.d.ts (згенерований)
export declare function greet(name: string): string;
```

## DefinitelyTyped

Типи для популярних бібліотек в `@types/*`:

```bash
npm install lodash
npm install @types/lodash --save-dev
```

```typescript
import _ from 'lodash';

// TypeScript знає типи завдяки @types/lodash
_.chunk([1, 2, 3, 4], 2); // number[][]
```

## Написання Declaration Files

### Глобальні змінні

```typescript
// globals.d.ts
declare const VERSION: string;
declare const DEBUG: boolean;

declare function log(message: string): void;
```

### Модулі

```typescript
// my-library.d.ts
declare module 'my-library' {
  export function doSomething(): void;
  export const VERSION: string;

  export interface Config {
    debug: boolean;
    timeout: number;
  }

  export default class MyLibrary {
    constructor(config?: Config);
    start(): void;
    stop(): void;
  }
}
```

### Розширення існуючих типів

```typescript
// express.d.ts
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      name: string;
    };
  }
}
```

### Глобальні розширення

```typescript
// global.d.ts
declare global {
  interface Window {
    myApp: {
      version: string;
      init(): void;
    };
  }

  // Розширення Array
  interface Array<T> {
    first(): T | undefined;
    last(): T | undefined;
  }
}

export {}; // Робить файл модулем
```

## Ambient Declarations

Опис існуючих JavaScript об'єктів:

```typescript
// jquery.d.ts
declare const $: JQueryStatic;

interface JQueryStatic {
  (selector: string): JQuery;
  ajax(settings: AjaxSettings): void;
}

interface JQuery {
  html(): string;
  html(content: string): this;
  click(handler: () => void): this;
  addClass(className: string): this;
}

interface AjaxSettings {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
  success?: (data: unknown) => void;
  error?: (error: Error) => void;
}
```

## Namespaces в .d.ts

```typescript
// lodash.d.ts
declare namespace _ {
  function chunk<T>(array: T[], size: number): T[][];
  function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[];
  function uniq<T>(array: T[]): T[];

  interface LodashStatic {
    chunk: typeof chunk;
    compact: typeof compact;
    uniq: typeof uniq;
  }
}

declare const _: _.LodashStatic;
export = _;
```

## Triple-Slash Directives

Посилання на інші файли типів:

```typescript
/// <reference path="./globals.d.ts" />
/// <reference types="node" />
/// <reference lib="es2020" />

declare module 'my-module' {
  // ...
}
```

## Шаблони для різних бібліотек

### UMD бібліотека

```typescript
// library.d.ts
export as namespace MyLibrary;

export function doSomething(): void;
export class MyClass {
  constructor(value: string);
  getValue(): string;
}
```

### Callback-based API

```typescript
// async-lib.d.ts
declare module 'async-lib' {
  type Callback<T> = (error: Error | null, result?: T) => void;

  export function readFile(path: string, callback: Callback<string>): void;
  export function writeFile(path: string, data: string, callback: Callback<void>): void;
}
```

### Плагін для іншої бібліотеки

```typescript
// express-session.d.ts
import 'express';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    cart?: string[];
  }
}

declare module 'express' {
  interface Request {
    session: import('express-session').Session &
             Partial<import('express-session').SessionData>;
  }
}
```

## Публікація типів в npm

### Варіант 1: Типи в пакеті

```json
// package.json
{
  "name": "my-library",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### Варіант 2: Окремий пакет типів

```json
// package.json для @types/my-library
{
  "name": "@types/my-library",
  "types": "index.d.ts",
  "dependencies": {}
}
```

## Практичні завдання

```typescript
// 1. Створи типи для простої бібліотеки
declare module 'simple-math' {
  export function add(a: number, b: number): number;
  export function subtract(a: number, b: number): number;
  export const PI: number;
}

// 2. Розшир Window
declare global {
  interface Window {
    analytics: {
      track(event: string, data?: Record<string, unknown>): void;
      identify(userId: string): void;
    };
  }
}

// 3. Створи типи для callback API
declare module 'legacy-api' {
  type Callback<T> = (err: Error | null, data?: T) => void;

  export function fetchData(url: string, cb: Callback<unknown>): void;
  export function saveData(data: unknown, cb: Callback<boolean>): void;
}

// 4. Створи типи для Express middleware
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    startTime: number;
    requestId: string;
  }
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void;
```

## Висновок

| Концепт | Опис |
|---------|------|
| `.d.ts` | Файл з типами без реалізації |
| `declare` | Оголошення існуючого JS коду |
| `@types/*` | Типи з DefinitelyTyped |
| `declare module` | Типи для модуля |
| `declare global` | Глобальні розширення |
| `/// <reference>` | Посилання на інші типи |

Declaration files — міст між JavaScript і TypeScript!
