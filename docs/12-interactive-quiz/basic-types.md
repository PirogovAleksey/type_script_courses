<script setup>
const questions = [
  {
    question: "Який тип має змінна: let x = 42;",
    code: "let x = 42;",
    options: ["string", "number", "any", "unknown"],
    correct: 1,
    explanation: "TypeScript автоматично виводить тип number з числового значення."
  },
  {
    question: "Яка різниця між any та unknown?",
    options: [
      "Немає різниці",
      "any безпечніший за unknown",
      "unknown вимагає перевірки типу перед використанням",
      "unknown не можна присвоїти змінній"
    ],
    correct: 2,
    explanation: "unknown безпечніший — потрібно перевірити тип перед використанням методів."
  },
  {
    question: "Що станеться при компіляції цього коду?",
    code: "let name: string = null;",
    options: [
      "Компіляція успішна",
      "Помилка: null не можна присвоїти string",
      "Залежить від strictNullChecks",
      "Runtime помилка"
    ],
    correct: 2,
    explanation: "З strictNullChecks: true це помилка. Без нього — дозволено."
  },
  {
    question: "Який тип поверне функція?",
    code: "function test() { return null; }",
    options: ["void", "null", "undefined", "never"],
    correct: 1,
    explanation: "TypeScript виводить тип повернення як null з return виразу."
  },
  {
    question: "Що таке literal type?",
    code: "let status: 'active' | 'inactive';",
    options: [
      "Тип для рядків",
      "Тип з конкретними допустимими значеннями",
      "Тип для об'єктів",
      "Синонім string"
    ],
    correct: 1,
    explanation: "Literal types обмежують значення конкретними варіантами."
  },
  {
    question: "Чи скомпілюється цей код?",
    code: "const arr: number[] = [1, 2, '3'];",
    options: [
      "Так, без помилок",
      "Ні, '3' не є number",
      "Так, з попередженням",
      "Залежить від налаштувань"
    ],
    correct: 1,
    explanation: "Рядок '3' не відповідає типу number[], тому буде помилка."
  },
  {
    question: "Яка різниця між number[] та Array<number>?",
    options: [
      "number[] швидший",
      "Array<number> підтримує більше методів",
      "Немає різниці, це синоніми",
      "Array<number> тільки для readonly"
    ],
    correct: 2,
    explanation: "Обидва синтаксиси еквівалентні, різниці в функціональності немає."
  },
  {
    question: "Що таке tuple в TypeScript?",
    code: "let point: [number, number] = [10, 20];",
    options: [
      "Масив будь-якої довжини",
      "Масив фіксованої довжини з типами для кожної позиції",
      "Об'єкт з двома властивостями",
      "Спеціальний тип для координат"
    ],
    correct: 1,
    explanation: "Tuple — масив з фіксованою кількістю елементів та типами."
  },
  {
    question: "Яке значення enum за замовчуванням?",
    code: "enum Color { Red, Green, Blue }",
    options: [
      "Red = 'Red', Green = 'Green'...",
      "Red = 0, Green = 1, Blue = 2",
      "Red = 1, Green = 2, Blue = 3",
      "Немає значень за замовчуванням"
    ],
    correct: 1,
    explanation: "Числові enum починаються з 0 за замовчуванням."
  },
  {
    question: "Коли використовувати never?",
    options: [
      "Для опціональних параметрів",
      "Для функцій, що ніколи не повертаються",
      "Для null значень",
      "Для порожніх масивів"
    ],
    correct: 1,
    explanation: "never для функцій, що кидають помилку або мають нескінченний цикл."
  },
  {
    question: "Що виведе typeof для null?",
    code: "console.log(typeof null);",
    options: ["'null'", "'undefined'", "'object'", "'none'"],
    correct: 2,
    explanation: "Це історична особливість JavaScript — typeof null === 'object'."
  },
  {
    question: "Яка різниця між void та undefined?",
    options: [
      "Немає різниці",
      "void для функцій, undefined для змінних",
      "void означає 'нічого не повертає', undefined — конкретне значення",
      "undefined застаріле"
    ],
    correct: 2,
    explanation: "void — тип для функцій без return, undefined — конкретне значення."
  },
  {
    question: "Чи можна змінити const змінну?",
    code: "const user = { name: 'Anna' };\nuser.name = 'John';",
    options: [
      "Ні, const не можна змінювати",
      "Так, можна змінювати властивості об'єкта",
      "Помилка компіляції",
      "Runtime помилка"
    ],
    correct: 1,
    explanation: "const захищає посилання, але не властивості об'єкта."
  },
  {
    question: "Що робить as const?",
    code: "const colors = ['red', 'green'] as const;",
    options: [
      "Робить масив readonly",
      "Перетворює на string[]",
      "Робить readonly та literal types",
      "Нічого не змінює"
    ],
    correct: 2,
    explanation: "as const робить значення readonly та виводить literal types."
  },
  {
    question: "Який тип result?",
    code: "const result = [1, 'two', true];",
    options: [
      "any[]",
      "(number | string | boolean)[]",
      "[number, string, boolean]",
      "unknown[]"
    ],
    correct: 1,
    explanation: "TypeScript виводить union type для всіх елементів масиву."
  },
  {
    question: "Чи валідний цей код?",
    code: "let x: bigint = 123;",
    options: [
      "Так, валідний",
      "Ні, потрібно 123n або BigInt(123)",
      "Залежить від target в tsconfig",
      "bigint не існує"
    ],
    correct: 1,
    explanation: "bigint вимагає суфікс n або виклик BigInt()."
  },
  {
    question: "Що таке symbol?",
    options: [
      "Тип для емодзі",
      "Унікальний ідентифікатор",
      "Математичний символ",
      "Альтернатива string"
    ],
    correct: 1,
    explanation: "Symbol створює унікальний ідентифікатор, кожен Symbol унікальний."
  },
  {
    question: "Яка різниця?",
    code: "type A = string | number;\ntype B = string & number;",
    options: [
      "A — об'єднання, B — перетин",
      "Немає різниці",
      "B неможливий (never)",
      "A — перетин, B — об'єднання"
    ],
    correct: 2,
    explanation: "string & number = never, бо немає значень, що є і string, і number."
  },
  {
    question: "Що поверне Object.keys()?",
    code: "const obj = { a: 1, b: 2 };\nObject.keys(obj);",
    options: [
      "('a' | 'b')[]",
      "string[]",
      "['a', 'b']",
      "keyof typeof obj"
    ],
    correct: 1,
    explanation: "Object.keys() завжди повертає string[] в TypeScript."
  },
  {
    question: "Чи можна присвоїти?",
    code: "let a: number = 5;\nlet b: Number = a;",
    options: [
      "Так, без проблем",
      "Ні, number і Number різні",
      "Тільки з as",
      "Залежить від strict"
    ],
    correct: 0,
    explanation: "number (примітив) можна присвоїти Number (об'єкт-обгортка)."
  },
  {
    question: "Що означає ?. оператор?",
    code: "user?.address?.city",
    options: [
      "Тернарний оператор",
      "Optional chaining — безпечний доступ",
      "Nullish coalescing",
      "Type assertion"
    ],
    correct: 1,
    explanation: "Optional chaining повертає undefined якщо проміжне значення null/undefined."
  },
  {
    question: "Що означає ?? оператор?",
    code: "const value = input ?? 'default';",
    options: [
      "Логічне OR",
      "Перевірка на null або undefined",
      "Перевірка на falsy",
      "Type guard"
    ],
    correct: 1,
    explanation: "Nullish coalescing повертає праву частину тільки для null/undefined."
  },
  {
    question: "Яка різниця між || та ??",
    code: "0 || 'default' // ?\n0 ?? 'default' // ?",
    options: [
      "Однаковий результат",
      "|| поверне 'default', ?? поверне 0",
      "|| поверне 0, ?? поверне 'default'",
      "Обидва помилка"
    ],
    correct: 1,
    explanation: "|| перевіряє falsy (включно з 0), ?? тільки null/undefined."
  },
  {
    question: "Що таке type assertion?",
    code: "const input = document.getElementById('inp') as HTMLInputElement;",
    options: [
      "Перевірка типу в runtime",
      "Вказівка компілятору про тип",
      "Створення нового типу",
      "Валідація даних"
    ],
    correct: 1,
    explanation: "Type assertion каже компілятору 'довіряй мені, це цей тип'."
  },
  {
    question: "Чи безпечний цей код?",
    code: "const x = someValue as any as number;",
    options: [
      "Так, повністю безпечний",
      "Ні, double assertion обходить перевірки",
      "Помилка компіляції",
      "Залежить від someValue"
    ],
    correct: 1,
    explanation: "Double assertion (через any) обходить перевірки типів — небезпечно!"
  },
  {
    question: "Що таке ! (non-null assertion)?",
    code: "const el = document.getElementById('app')!;",
    options: [
      "Логічне заперечення",
      "Гарантія що значення не null/undefined",
      "Помилка якщо null",
      "Runtime перевірка"
    ],
    correct: 1,
    explanation: "! каже TS що ви впевнені — значення не null/undefined. Без runtime перевірки!"
  },
  {
    question: "Який тип x?",
    code: "const x = 'hello' as const;",
    options: [
      "string",
      "'hello' (literal)",
      "const string",
      "readonly string"
    ],
    correct: 1,
    explanation: "as const виводить literal type 'hello' замість загального string."
  },
  {
    question: "Чи можна так?",
    code: "type Status = 'active';\nlet s: Status = 'active';\ns = 'inactive';",
    options: [
      "Так, рядки сумісні",
      "Ні, 'inactive' не є Status",
      "Попередження",
      "Залежить від налаштувань"
    ],
    correct: 1,
    explanation: "Status тільки 'active', тому 'inactive' — помилка типу."
  },
  {
    question: "Що виведе код?",
    code: "const obj = { a: 1 } as const;\nconsole.log(typeof obj.a);",
    options: [
      "'number'",
      "'1'",
      "'const'",
      "'literal'"
    ],
    correct: 0,
    explanation: "typeof в runtime все одно поверне 'number', as const впливає тільки на типи."
  },
  {
    question: "Яка перевага unknown над any?",
    options: [
      "unknown швидший",
      "unknown сумісний з більшою кількістю типів",
      "unknown вимагає type narrowing перед використанням",
      "Немає переваг"
    ],
    correct: 2,
    explanation: "unknown змушує перевіряти тип, що робить код безпечнішим."
  }
]
</script>

# Quiz: Базові типи

Інтерактивний тест з 15 випадкових питань. При кожному проходженні питання обираються випадково.

<Quiz :questions="questions" :count="15" />
