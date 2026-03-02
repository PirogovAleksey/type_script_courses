# Налаштування середовища

Для роботи з TypeScript потрібно встановити кілька інструментів.

## Крок 1: Встановлення Node.js

Завантаж та встанови Node.js з офіційного сайту: [nodejs.org](https://nodejs.org)

Перевір встановлення:

```bash
node --version
npm --version
```

## Крок 2: Встановлення TypeScript

### Глобально (для CLI)

```bash
npm install -g typescript
```

Перевір встановлення:

```bash
tsc --version
```

### Локально в проєкті (рекомендовано)

```bash
npm init -y
npm install typescript --save-dev
```

## Крок 3: Створення проєкту

Створи нову папку та ініціалізуй проєкт:

```bash
mkdir my-ts-project
cd my-ts-project
npm init -y
npm install typescript --save-dev
```

Ініціалізуй TypeScript конфігурацію:

```bash
npx tsc --init
```

Це створить файл `tsconfig.json`.

## Крок 4: Базова структура проєкту

```
my-ts-project/
├── src/
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json
```

## Крок 5: Налаштування tsconfig.json

Базове налаштування:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

## Крок 6: Перший TypeScript файл

Створи `src/index.ts`:

```typescript
const greeting: string = 'Hello, TypeScript!';
console.log(greeting);

function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(10, 20));
```

## Крок 7: Компіляція та запуск

Скомпілюй TypeScript:

```bash
npx tsc
```

Запусти JavaScript:

```bash
node dist/index.js
```

## Автоматична компіляція

Для автоматичної перекомпіляції при змінах:

```bash
npx tsc --watch
```

## Рекомендовані розширення VS Code

- **TypeScript and JavaScript Language Features** (вбудовано)
- **Error Lens** — показує помилки inline
- **Pretty TypeScript Errors** — форматує помилки

## Корисні npm скрипти

Додай в `package.json`:

```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js"
  }
}
```

Тепер можна використовувати:

```bash
npm run build   # Компіляція
npm run watch   # Автокомпіляція
npm run start   # Запуск
npm run dev     # Компіляція + запуск
```

## Висновок

Середовище готове! Тепер можемо переходити до вивчення типів TypeScript.
