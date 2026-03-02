# Налаштування tsconfig.json

`tsconfig.json` — конфігурація TypeScript компілятора.

## Створення файлу

```bash
npx tsc --init
```

## Базова структура

```json
{
  "compilerOptions": {
    // Налаштування компілятора
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Основні опції

### target

Версія JavaScript на виході:

```json
{
  "compilerOptions": {
    "target": "ES2020"  // ES5, ES6, ES2015-ES2023, ESNext
  }
}
```

| Target | Підтримка |
|--------|-----------|
| ES5 | IE11, старі браузери |
| ES2015 | Сучасні браузери |
| ES2020 | async/await, optional chaining |
| ESNext | Найновіші функції |

### module

Система модулів:

```json
{
  "compilerOptions": {
    "module": "ESNext"  // CommonJS, ES6, ESNext, NodeNext
  }
}
```

| Module | Використання |
|--------|-------------|
| CommonJS | Node.js (require/module.exports) |
| ESNext | Сучасний JS (import/export) |
| NodeNext | Node.js 16+ з ES modules |

### moduleResolution

Як шукати модулі:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"  // node, bundler, NodeNext
  }
}
```

### outDir та rootDir

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}
```

## Strict режим

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict: true` вмикає:

| Опція | Опис |
|-------|------|
| strictNullChecks | null/undefined перевірки |
| strictFunctionTypes | Суворі типи функцій |
| strictBindCallApply | Перевірка bind/call/apply |
| strictPropertyInitialization | Ініціалізація властивостей |
| noImplicitAny | Заборона implicit any |
| noImplicitThis | Перевірка this |
| alwaysStrict | "use strict" в кожному файлі |

### Рекомендовані додаткові опції

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Paths та baseUrl

Аліаси для імпортів:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```typescript
// Замість: import { Button } from '../../../components/Button'
import { Button } from '@components/Button';
import { formatDate } from '@utils/formatters';
```

::: warning Увага
Для роботи paths потрібен bundler (Vite, webpack) або tsconfig-paths.
:::

## Source Maps

```json
{
  "compilerOptions": {
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

| Опція | Опис |
|-------|------|
| sourceMap | .js.map файли для дебагу |
| declaration | .d.ts файли типів |
| declarationMap | .d.ts.map для навігації |

## Lib

Вбудовані типи:

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"]
  }
}
```

| Lib | Опис |
|-----|------|
| ES2015-ES2023 | Типи ECMAScript |
| DOM | Браузерні API |
| WebWorker | Web Workers API |

## Include та Exclude

```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

## Extends

Наслідування конфігурації:

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext"
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

## Типові конфігурації

### Node.js проєкт

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### React проєкт (Vite)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Бібліотека

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## Корисні опції

```json
{
  "compilerOptions": {
    // Імпорт JSON
    "resolveJsonModule": true,

    // Сумісність з CommonJS
    "esModuleInterop": true,

    // Швидша компіляція
    "skipLibCheck": true,

    // Регістр файлів
    "forceConsistentCasingInFileNames": true,

    // Ізольовані модулі (для Babel, esbuild)
    "isolatedModules": true,

    // Не генерувати JS (коли використовується bundler)
    "noEmit": true,

    // Видаляти коментарі
    "removeComments": true
  }
}
```

## Практичне завдання

Створи конфігурацію для свого проєкту:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Висновок

- `strict: true` — завжди вмикай для нових проєктів
- `target` та `module` залежать від середовища
- `paths` для зручних імпортів
- `skipLibCheck` для швидшої компіляції
- Використовуй `extends` для спільних налаштувань
