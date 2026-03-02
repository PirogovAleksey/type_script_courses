<script setup>
const questions = [
  {
    question: "Що таке Generic?",
    code: "function identity<T>(arg: T): T { return arg; }",
    options: [
      "Звичайна функція",
      "Функція з параметром типу",
      "Async функція",
      "Функція з any"
    ],
    correct: 1,
    explanation: "Generic — параметризований тип, T визначається при використанні."
  },
  {
    question: "Як викликати generic функцію?",
    code: "function identity<T>(x: T): T { return x; }",
    options: [
      "Тільки з явним типом: identity<string>('hi')",
      "Тільки без типу: identity('hi')",
      "Обома способами, TS може вивести тип",
      "Потрібен type assertion"
    ],
    correct: 2,
    explanation: "TypeScript може вивести T з аргументу, або можна вказати явно."
  },
  {
    question: "Що означає constraint?",
    code: "function fn<T extends { length: number }>(x: T)",
    options: [
      "T повинен мати властивість length",
      "T не може мати length",
      "length опціональний",
      "T стає number"
    ],
    correct: 0,
    explanation: "extends обмежує T типами, що мають length: number."
  },
  {
    question: "Чи скомпілюється?",
    code: "function getLength<T>(arg: T): number {\n  return arg.length;\n}",
    options: [
      "Так",
      "Ні, T не гарантує length",
      "Залежить від виклику",
      "Попередження"
    ],
    correct: 1,
    explanation: "Потрібен constraint: T extends { length: number }."
  },
  {
    question: "Що таке keyof?",
    code: "type Keys = keyof { a: 1, b: 2 };",
    options: [
      "['a', 'b']",
      "'a' | 'b'",
      "{ a: true, b: true }",
      "2"
    ],
    correct: 1,
    explanation: "keyof повертає union всіх ключів об'єкта."
  },
  {
    question: "Як обмежити generic ключами об'єкта?",
    code: "function get<T, K extends ???>(obj: T, key: K)",
    options: [
      "K extends string",
      "K extends keyof T",
      "K extends keys T",
      "K in T"
    ],
    correct: 1,
    explanation: "K extends keyof T обмежує K ключами об'єкта T."
  },
  {
    question: "Що таке T[K]?",
    code: "function get<T, K extends keyof T>(obj: T, key: K): T[K]",
    options: [
      "Індекс масиву",
      "Тип властивості K в об'єкті T",
      "Помилка синтаксису",
      "Generic constraint"
    ],
    correct: 1,
    explanation: "T[K] — indexed access type, тип властивості K в T."
  },
  {
    question: "Скільки generic параметрів може бути?",
    code: "function fn<A, B, C, D>(...)",
    options: [
      "Тільки один",
      "Максимум два",
      "Необмежена кількість",
      "Залежить від TS версії"
    ],
    correct: 2,
    explanation: "Кількість generic параметрів не обмежена."
  },
  {
    question: "Що таке default generic?",
    code: "interface Box<T = string> { value: T }",
    options: [
      "T завжди string",
      "T = string якщо не вказано",
      "T не може бути іншим",
      "Помилка синтаксису"
    ],
    correct: 1,
    explanation: "Default generic використовується коли тип не вказано явно."
  },
  {
    question: "Яка різниця?",
    code: "Array<string | number> vs Array<string> | Array<number>",
    options: [
      "Немає різниці",
      "Перший — змішаний масив, другий — один тип",
      "Другий — змішаний масив",
      "Обидва помилка"
    ],
    correct: 1,
    explanation: "Array<A|B> може мати і A, і B. Array<A>|Array<B> — тільки один тип."
  },
  {
    question: "Що таке mapped type?",
    code: "type Readonly<T> = { readonly [K in keyof T]: T[K] }",
    options: [
      "Копіювання типу",
      "Трансформація всіх властивостей",
      "Union type",
      "Conditional type"
    ],
    correct: 1,
    explanation: "Mapped type ітерує по ключах і трансформує кожну властивість."
  },
  {
    question: "Що робить Partial<T>?",
    options: [
      "Робить всі властивості readonly",
      "Робить всі властивості опціональними",
      "Видаляє властивості",
      "Додає властивості"
    ],
    correct: 1,
    explanation: "Partial робить всі властивості optional (?)."
  },
  {
    question: "Що робить Required<T>?",
    options: [
      "Робить всі властивості обов'язковими",
      "Перевіряє наявність властивостей",
      "Видаляє optional",
      "A і C правильні"
    ],
    correct: 3,
    explanation: "Required видаляє ? і робить всі властивості обов'язковими."
  },
  {
    question: "Як працює Pick?",
    code: "type T = Pick<{ a: 1, b: 2, c: 3 }, 'a' | 'b'>",
    options: [
      "{ a: 1, b: 2 }",
      "{ c: 3 }",
      "'a' | 'b'",
      "Помилка"
    ],
    correct: 0,
    explanation: "Pick вибирає тільки вказані властивості."
  },
  {
    question: "Як працює Omit?",
    code: "type T = Omit<{ a: 1, b: 2, c: 3 }, 'c'>",
    options: [
      "{ c: 3 }",
      "{ a: 1, b: 2 }",
      "'a' | 'b'",
      "Помилка"
    ],
    correct: 1,
    explanation: "Omit виключає вказані властивості."
  },
  {
    question: "Що таке conditional type?",
    code: "type T = A extends B ? C : D",
    options: [
      "Тернарний оператор для типів",
      "Runtime перевірка",
      "Type guard",
      "Constraint"
    ],
    correct: 0,
    explanation: "Conditional type — умовний тип залежно від extends."
  },
  {
    question: "Що робить infer?",
    code: "type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never",
    options: [
      "Оголошує змінну",
      "Виводить тип з pattern",
      "Перевіряє тип",
      "Constraint"
    ],
    correct: 1,
    explanation: "infer витягує тип з умови (тут — return type функції)."
  },
  {
    question: "Що поверне Awaited?",
    code: "type T = Awaited<Promise<Promise<string>>>;",
    options: [
      "Promise<string>",
      "Promise<Promise<string>>",
      "string",
      "never"
    ],
    correct: 2,
    explanation: "Awaited рекурсивно розгортає Promise до базового типу."
  },
  {
    question: "Як створити generic клас?",
    code: "class Box<T> { value: T; }",
    options: [
      "Так, синтаксис правильний",
      "Потрібен extends",
      "Класи не підтримують generic",
      "Потрібен constructor"
    ],
    correct: 0,
    explanation: "Generic класи працюють так само як функції."
  },
  {
    question: "Чи можуть static методи використовувати T класу?",
    code: "class Box<T> { static create(): T { } }",
    options: [
      "Так",
      "Ні, static не має доступу до T",
      "Тільки з extends",
      "Тільки в constructor"
    ],
    correct: 1,
    explanation: "Static методи не мають доступу до generic параметра класу."
  },
  {
    question: "Як типізувати generic interface?",
    code: "interface Container<T> { value: T; getValue(): T; }",
    options: [
      "Помилка — interface не підтримує generic",
      "Правильний синтаксис",
      "Потрібен type замість interface",
      "getValue не може використовувати T"
    ],
    correct: 1,
    explanation: "Interface повністю підтримує generic параметри."
  },
  {
    question: "Що таке distributive conditional types?",
    code: "type T = (A | B) extends X ? Y : Z",
    options: [
      "Умова застосовується до кожного члена union",
      "Union перевіряється цілком",
      "Помилка синтаксису",
      "Залежить від X"
    ],
    correct: 0,
    explanation: "Conditional type розподіляється по union: (A extends X ? Y : Z) | (B extends X ? Y : Z)."
  },
  {
    question: "Як уникнути distribution?",
    code: "type T<U> = [U] extends [X] ? Y : Z",
    options: [
      "Використати tuple []",
      "Використати never",
      "Неможливо",
      "Використати any"
    ],
    correct: 0,
    explanation: "Обгортка в tuple [U] prevents distribution."
  },
  {
    question: "Що таке Record<K, V>?",
    code: "type T = Record<'a' | 'b', number>;",
    options: [
      "{ a: number, b: number }",
      "['a', 'b']",
      "Map<string, number>",
      "Array<number>"
    ],
    correct: 0,
    explanation: "Record створює об'єкт з ключами K та значеннями V."
  },
  {
    question: "Що робить Exclude?",
    code: "type T = Exclude<'a' | 'b' | 'c', 'a'>;",
    options: [
      "'a'",
      "'b' | 'c'",
      "'a' | 'b' | 'c'",
      "never"
    ],
    correct: 1,
    explanation: "Exclude видаляє вказані типи з union."
  },
  {
    question: "Що робить Extract?",
    code: "type T = Extract<'a' | 'b' | 1, string>;",
    options: [
      "'a' | 'b'",
      "1",
      "string",
      "never"
    ],
    correct: 0,
    explanation: "Extract залишає тільки типи що extends другий аргумент."
  },
  {
    question: "Що таке NonNullable?",
    code: "type T = NonNullable<string | null | undefined>;",
    options: [
      "string | null",
      "string | undefined",
      "string",
      "never"
    ],
    correct: 2,
    explanation: "NonNullable видаляє null і undefined."
  },
  {
    question: "Як отримати тип елемента масиву?",
    code: "type T = string[];\ntype Element = ???;",
    options: [
      "T[0]",
      "T[number]",
      "ElementOf<T>",
      "T.element"
    ],
    correct: 1,
    explanation: "T[number] — indexed access для отримання типу елемента."
  },
  {
    question: "Що робить -readonly?",
    code: "type Mutable<T> = { -readonly [K in keyof T]: T[K] }",
    options: [
      "Додає readonly",
      "Видаляє readonly",
      "Помилка синтаксису",
      "Нічого"
    ],
    correct: 1,
    explanation: "-readonly видаляє модифікатор readonly."
  },
  {
    question: "Що робить +??",
    code: "type Required<T> = { [K in keyof T]-?: T[K] }",
    options: [
      "-? видаляє optional",
      "+? додає optional",
      "Помилка",
      "-? і +? однакові"
    ],
    correct: 0,
    explanation: "-? видаляє optional модифікатор, +? додає (за замовчуванням)."
  }
]
</script>

# Quiz: Generics

Інтерактивний тест з 15 випадкових питань про Generics в TypeScript.

<Quiz :questions="questions" :count="15" />
