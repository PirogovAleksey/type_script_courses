<script setup>
const questions = [
  {
    question: "Що таке interface?",
    options: [
      "Клас без реалізації",
      "Опис форми об'єкта (контракт)",
      "Функція",
      "Модуль"
    ],
    correct: 1,
    explanation: "Interface описує структуру об'єкта: властивості та їх типи."
  },
  {
    question: "Яка різниця між interface та type?",
    options: [
      "Немає різниці",
      "interface для об'єктів, type для примітивів",
      "interface підтримує declaration merging",
      "type швидше"
    ],
    correct: 2,
    explanation: "Головна різниця — interface можна розширювати (declaration merging)."
  },
  {
    question: "Що таке declaration merging?",
    code: "interface A { x: number; }\ninterface A { y: string; }",
    options: [
      "Помилка — дублювання",
      "A має x і y",
      "Друга декларація перезаписує",
      "Тільки для type"
    ],
    correct: 1,
    explanation: "Interface з однаковим ім'ям об'єднуються."
  },
  {
    question: "Чи може type мати declaration merging?",
    code: "type A = { x: number; }\ntype A = { y: string; }",
    options: [
      "Так",
      "Ні, буде помилка",
      "Залежить від strict",
      "Тільки з extends"
    ],
    correct: 1,
    explanation: "type не підтримує declaration merging — буде помилка."
  },
  {
    question: "Як розширити interface?",
    code: "interface B extends A { }",
    options: [
      "Так, через extends",
      "Тільки implements",
      "Неможливо",
      "Через &"
    ],
    correct: 0,
    explanation: "interface extends interface для розширення."
  },
  {
    question: "Чи можна interface extends type?",
    code: "type A = { x: number; }\ninterface B extends A { y: string; }",
    options: [
      "Ні, тільки interface",
      "Так, можна",
      "Тільки навпаки",
      "Помилка"
    ],
    correct: 1,
    explanation: "interface може розширювати і interface, і type."
  },
  {
    question: "Як створити intersection type?",
    code: "type C = A & B;",
    options: [
      "Об'єднання типів (має всі властивості)",
      "Вибір одного з типів",
      "Помилка синтаксису",
      "Тільки для interface"
    ],
    correct: 0,
    explanation: "& створює intersection — тип має всі властивості A і B."
  },
  {
    question: "Як створити union type?",
    code: "type C = A | B;",
    options: [
      "Тип що відповідає A або B",
      "Тип що має всі властивості",
      "Помилка",
      "Тільки для примітивів"
    ],
    correct: 0,
    explanation: "| створює union — значення може бути A або B."
  },
  {
    question: "Що таке опціональна властивість?",
    code: "interface A { x?: number; }",
    options: [
      "Властивість може бути undefined",
      "Властивість обов'язкова",
      "Властивість readonly",
      "Властивість private"
    ],
    correct: 0,
    explanation: "? робить властивість опціональною (може бути відсутня)."
  },
  {
    question: "Що таке readonly властивість?",
    code: "interface A { readonly x: number; }",
    options: [
      "Не можна читати",
      "Не можна змінювати після присвоєння",
      "Private доступ",
      "Static властивість"
    ],
    correct: 1,
    explanation: "readonly забороняє зміну після ініціалізації."
  },
  {
    question: "Що таке index signature?",
    code: "interface A { [key: string]: number; }",
    options: [
      "Масив рядків",
      "Об'єкт з будь-якими string ключами та number значеннями",
      "Помилка синтаксису",
      "Tuple"
    ],
    correct: 1,
    explanation: "Index signature описує динамічні ключі."
  },
  {
    question: "Чи можна комбінувати index signature з властивостями?",
    code: "interface A { name: string; [key: string]: string; }",
    options: [
      "Так, якщо типи сумісні",
      "Ні, або одне, або інше",
      "Тільки number ключі",
      "Помилка"
    ],
    correct: 0,
    explanation: "Можна, але всі властивості мають відповідати index signature типу."
  },
  {
    question: "Як описати функцію в interface?",
    code: "interface Fn { (x: number): string; }",
    options: [
      "Так, call signature",
      "Помилка — функції не в interface",
      "Потрібен метод",
      "Тільки type"
    ],
    correct: 0,
    explanation: "Call signature описує функцію в interface."
  },
  {
    question: "Що таке construct signature?",
    code: "interface Ctor { new (x: number): MyClass; }",
    options: [
      "Опис конструктора",
      "Новий тип",
      "Помилка синтаксису",
      "Static метод"
    ],
    correct: 0,
    explanation: "new (...) описує конструктор класу."
  },
  {
    question: "Чи можна interface мати і call, і construct signature?",
    code: "interface A { (x: number): string; new (x: number): A; }",
    options: [
      "Так",
      "Ні, тільки одне",
      "Помилка",
      "Тільки type"
    ],
    correct: 0,
    explanation: "Interface може описувати callable та constructable одночасно."
  },
  {
    question: "Яка різниця методу і властивості-функції?",
    code: "interface A { method(): void; prop: () => void; }",
    options: [
      "Немає різниці",
      "Різниця в strictFunctionTypes",
      "prop не можна викликати",
      "method — async"
    ],
    correct: 1,
    explanation: "З strictFunctionTypes методи біваріантні, властивості — контраваріантні."
  },
  {
    question: "Що таке discriminated union?",
    code: "type Shape = { kind: 'circle'; r: number } | { kind: 'square'; s: number }",
    options: [
      "Union з спільною властивістю-дискримінатором",
      "Звичайний union",
      "Intersection",
      "Enum"
    ],
    correct: 0,
    explanation: "Discriminated union має спільну властивість для розрізнення типів."
  },
  {
    question: "Навіщо discriminated union?",
    options: [
      "Для type narrowing в switch/if",
      "Для швидкодії",
      "Для readonly",
      "Для generics"
    ],
    correct: 0,
    explanation: "TypeScript автоматично звужує тип за значенням дискримінатора."
  },
  {
    question: "Як перевірити тип в union?",
    code: "function process(shape: Shape) { if (shape.kind === 'circle') { } }",
    options: [
      "Через дискримінатор",
      "Через instanceof",
      "Неможливо",
      "Через as"
    ],
    correct: 0,
    explanation: "Перевірка дискримінатора звужує тип."
  },
  {
    question: "Що таке type alias?",
    code: "type ID = string | number;",
    options: [
      "Нове ім'я для існуючого типу",
      "Новий примітивний тип",
      "Клас",
      "Interface"
    ],
    correct: 0,
    explanation: "type alias створює псевдонім для типу."
  },
  {
    question: "Чи можна type для примітивів?",
    code: "type Age = number;",
    options: [
      "Так",
      "Ні, тільки interface",
      "Тільки з constraint",
      "Застаріле"
    ],
    correct: 0,
    explanation: "type може бути псевдонімом для будь-якого типу, включно з примітивами."
  },
  {
    question: "Чи може interface бути примітивом?",
    code: "interface Age extends number { }",
    options: [
      "Так",
      "Ні, interface тільки для об'єктів",
      "Тільки string",
      "Залежить від strict"
    ],
    correct: 1,
    explanation: "interface описує об'єкти, для примітивів використовуй type."
  },
  {
    question: "Що таке tuple type?",
    code: "type Point = [number, number];",
    options: [
      "Масив фіксованої довжини з типами позицій",
      "Звичайний масив",
      "Об'єкт",
      "Interface"
    ],
    correct: 0,
    explanation: "Tuple — масив де кожна позиція має свій тип."
  },
  {
    question: "Чи можна tuple в interface?",
    code: "interface Point extends Array<number> { 0: number; 1: number; length: 2; }",
    options: [
      "Так, але складно",
      "Краще використати type",
      "Помилка",
      "A і B правильні"
    ],
    correct: 3,
    explanation: "Можна, але type [number, number] простіше."
  },
  {
    question: "Що таке mapped type?",
    code: "type Partial<T> = { [K in keyof T]?: T[K] }",
    options: [
      "Тип що трансформує властивості",
      "Union type",
      "Intersection",
      "Тільки для interface"
    ],
    correct: 0,
    explanation: "Mapped type ітерує по ключах і трансформує кожну властивість."
  },
  {
    question: "Чи може interface використовувати mapped types?",
    options: [
      "Так",
      "Ні, тільки type",
      "Через extends",
      "Залежить від версії"
    ],
    correct: 1,
    explanation: "Mapped types працюють тільки з type, не interface."
  },
  {
    question: "Що таке conditional type?",
    code: "type T = A extends B ? C : D",
    options: [
      "Умовний тип",
      "Runtime перевірка",
      "Interface",
      "Тільки в type"
    ],
    correct: 0,
    explanation: "Conditional type вибирає тип залежно від умови."
  },
  {
    question: "Чи може interface мати conditional types?",
    options: [
      "Так",
      "Ні, тільки type",
      "Через extends",
      "Через implements"
    ],
    correct: 1,
    explanation: "Conditional types — функція type alias, не interface."
  },
  {
    question: "Коли використовувати interface?",
    options: [
      "Для опису об'єктів, публічних API",
      "Для union types",
      "Для primitives",
      "Для mapped types"
    ],
    correct: 0,
    explanation: "interface ідеальний для об'єктів та контрактів (public API)."
  },
  {
    question: "Коли використовувати type?",
    options: [
      "Для union, intersection, mapped, conditional types",
      "Тільки для примітивів",
      "Ніколи, interface краще",
      "Тільки для класів"
    ],
    correct: 0,
    explanation: "type гнучкіший: unions, intersections, mapped, conditional types."
  }
]
</script>

# Quiz: Інтерфейси та типи

Інтерактивний тест з 15 випадкових питань про interfaces та types.

<Quiz :questions="questions" :count="15" />
