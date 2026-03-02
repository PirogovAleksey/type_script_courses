<script setup>
const questions = [
  {
    question: "Як вказати опціональний параметр?",
    code: "function greet(name???): string",
    options: [
      "name: string | undefined",
      "name?: string",
      "name = undefined",
      "optional name: string"
    ],
    correct: 1,
    explanation: "Знак ? після імені параметра робить його опціональним."
  },
  {
    question: "Що поверне функція з типом void?",
    options: [
      "null",
      "undefined",
      "Нічого або undefined",
      "Помилку"
    ],
    correct: 2,
    explanation: "void означає функція не повертає значення (може повернути undefined)."
  },
  {
    question: "Чи валідний код?",
    code: "function test(a?: string, b: number) {}",
    options: [
      "Так, валідний",
      "Ні, опціональні параметри мають бути в кінці",
      "Залежить від strict",
      "Потрібен default value"
    ],
    correct: 1,
    explanation: "Опціональні параметри повинні йти після обов'язкових."
  },
  {
    question: "Що таке rest параметри?",
    code: "function sum(...numbers: number[])",
    options: [
      "Залишкові параметри у вигляді масиву",
      "Опціональні параметри",
      "Деструктуризація",
      "Spread оператор"
    ],
    correct: 0,
    explanation: "Rest параметри збирають всі додаткові аргументи в масив."
  },
  {
    question: "Яка різниця між цими функціями?",
    code: "type F1 = (x: number) => number;\ntype F2 = { (x: number): number };",
    options: [
      "F1 arrow function, F2 звичайна",
      "Немає різниці, обидві описують callable",
      "F2 може мати властивості",
      "F1 швидша"
    ],
    correct: 1,
    explanation: "Обидва синтаксиси описують функцію, що приймає number і повертає number."
  },
  {
    question: "Що робить this параметр?",
    code: "function greet(this: User, msg: string) {}",
    options: [
      "Створює змінну this",
      "Типізує контекст this",
      "Робить this обов'язковим",
      "Замінює this"
    ],
    correct: 1,
    explanation: "this параметр типізує контекст виклику, не впливає на виклик."
  },
  {
    question: "Як типізувати callback?",
    code: "function process(cb: ???) {}",
    options: [
      "callback",
      "Function",
      "(data: Data) => void",
      "any"
    ],
    correct: 2,
    explanation: "Найкраще явно вказати сигнатуру: параметри та тип повернення."
  },
  {
    question: "Що таке function overloading?",
    options: [
      "Виклик функції кілька разів",
      "Декілька сигнатур для різних типів параметрів",
      "Заміна функції",
      "Async функція"
    ],
    correct: 1,
    explanation: "Overloading дозволяє мати різні сигнатури для однієї функції."
  },
  {
    question: "Чи правильний overload?",
    code: "function fn(x: string): string;\nfunction fn(x: number): number;\nfunction fn(x: any): any { return x; }",
    options: [
      "Так, правильний",
      "Ні, implementation не може бути any",
      "Ні, потрібен return type",
      "Ні, потрібен export"
    ],
    correct: 0,
    explanation: "Implementation signature може бути ширшою, це правильний overload."
  },
  {
    question: "Яка сигнатура видима ззовні?",
    code: "function fn(x: string): string;\nfunction fn(x: number): number;\nfunction fn(x: any): any { return x; }",
    options: [
      "Всі три",
      "Тільки перші дві",
      "Тільки остання",
      "Жодна"
    ],
    correct: 1,
    explanation: "Implementation signature не видима, тільки overload signatures."
  },
  {
    question: "Що означає never як return type?",
    options: [
      "Функція повертає null",
      "Функція ніколи не завершується нормально",
      "Функція deprecated",
      "Функція async"
    ],
    correct: 1,
    explanation: "never для функцій що кидають помилку або мають нескінченний цикл."
  },
  {
    question: "Чим відрізняється =>  від function?",
    code: "const fn = () => this.value;\nfunction fn() { return this.value; }",
    options: [
      "Нічим",
      "Arrow function зберігає this з контексту створення",
      "function швидше",
      "Arrow не може мати параметри"
    ],
    correct: 1,
    explanation: "Arrow functions захоплюють this лексично з оточення."
  },
  {
    question: "Як типізувати generic функцію?",
    code: "function identity<T>(arg: T): T { return arg; }",
    options: [
      "Тільки з explicit types",
      "T виводиться з аргументів",
      "Потрібен extends",
      "Generic не для функцій"
    ],
    correct: 1,
    explanation: "TypeScript може вивести T з переданого аргументу."
  },
  {
    question: "Що таке ReturnType<T>?",
    code: "type Result = ReturnType<typeof myFunc>;",
    options: [
      "Параметри функції",
      "Тип повернення функції",
      "Ім'я функції",
      "Кількість параметрів"
    ],
    correct: 1,
    explanation: "ReturnType витягує тип, який функція повертає."
  },
  {
    question: "Що таке Parameters<T>?",
    code: "type Params = Parameters<typeof myFunc>;",
    options: [
      "Tuple типів параметрів",
      "Кількість параметрів",
      "Імена параметрів",
      "Об'єкт параметрів"
    ],
    correct: 0,
    explanation: "Parameters повертає tuple з типами всіх параметрів."
  },
  {
    question: "Чи можна викликати?",
    code: "function test(): never { throw new Error(); }\ntest();",
    options: [
      "Ні, never не можна викликати",
      "Так, але після виклику код недосяжний",
      "Помилка компіляції",
      "Runtime error"
    ],
    correct: 1,
    explanation: "Можна викликати, але код після виклику буде unreachable."
  },
  {
    question: "Яка різниця?",
    code: "type A = () => void;\ntype B = () => undefined;",
    options: [
      "Немає різниці",
      "A може не повертати, B повинна повертати undefined",
      "B не валідний",
      "A для async"
    ],
    correct: 1,
    explanation: "void дозволяє не повертати нічого, undefined вимагає return undefined."
  },
  {
    question: "Як типізувати async функцію?",
    code: "async function fetch(): ??? { return data; }",
    options: [
      "Data",
      "Promise<Data>",
      "async Data",
      "Awaited<Data>"
    ],
    correct: 1,
    explanation: "Async функції завжди повертають Promise."
  },
  {
    question: "Що робить asserts?",
    code: "function assert(x: unknown): asserts x is string",
    options: [
      "Перевіряє тип в runtime",
      "Звужує тип після виклику",
      "Кидає помилку якщо не string",
      "Все вищезгадане"
    ],
    correct: 3,
    explanation: "asserts і перевіряє, і кидає помилку, і звужує тип."
  },
  {
    question: "Як типізувати конструктор?",
    code: "function create(ctor: ???) { return new ctor(); }",
    options: [
      "Function",
      "new () => T",
      "constructor",
      "Class<T>"
    ],
    correct: 1,
    explanation: "new () => T описує конструктор що повертає T."
  },
  {
    question: "Що таке type predicate?",
    code: "function isString(x: unknown): x is string",
    options: [
      "Boolean функція",
      "Функція що звужує тип",
      "Type assertion",
      "Generic constraint"
    ],
    correct: 1,
    explanation: "Type predicate дозволяє TypeScript звузити тип в if блоці."
  },
  {
    question: "Чи валідний default value?",
    code: "function greet(name: string = null) {}",
    options: [
      "Так",
      "Ні, null не string",
      "Залежить від strictNullChecks",
      "Потрібен union type"
    ],
    correct: 2,
    explanation: "З strictNullChecks: true це помилка, потрібен string | null."
  },
  {
    question: "Що поверне typeof для функції?",
    code: "function test() {}\nconsole.log(typeof test);",
    options: [
      "'function'",
      "'object'",
      "'Function'",
      "'callable'"
    ],
    correct: 0,
    explanation: "typeof для функцій повертає рядок 'function'."
  },
  {
    question: "Як отримати тип функції?",
    code: "function myFunc(a: number): string { return ''; }",
    options: [
      "type T = myFunc",
      "type T = typeof myFunc",
      "type T = Function<myFunc>",
      "type T = ReturnType<myFunc>"
    ],
    correct: 1,
    explanation: "typeof myFunc дає тип функції (a: number) => string."
  },
  {
    question: "Чи можна мати різні return types в overload?",
    code: "function fn(x: string): string;\nfunction fn(x: number): number;",
    options: [
      "Ні, return type має бути однаковий",
      "Так, кожна сигнатура може мати свій тип",
      "Тільки з union",
      "Тільки з generic"
    ],
    correct: 1,
    explanation: "Overload дозволяє різні return types для різних input types."
  },
  {
    question: "Що таке contextual typing?",
    code: "const handler: (e: Event) => void = (e) => {};",
    options: [
      "Явна типізація",
      "TypeScript виводить тип e з контексту",
      "Runtime типізація",
      "Generic inference"
    ],
    correct: 1,
    explanation: "Contextual typing — TS виводить типи параметрів з контексту."
  },
  {
    question: "Як типізувати метод класу?",
    code: "class C { method(x: number): string { return ''; } }",
    options: [
      "Як звичайну функцію",
      "Потрібен this параметр",
      "Потрібен static",
      "Методи не типізуються"
    ],
    correct: 0,
    explanation: "Методи типізуються так само як функції."
  },
  {
    question: "Що робить bind з типами?",
    code: "const fn = obj.method.bind(obj);",
    options: [
      "Зберігає повну типізацію",
      "Втрачає типи параметрів",
      "Повертає any",
      "Залежить від strictBindCallApply"
    ],
    correct: 3,
    explanation: "З strictBindCallApply типи зберігаються, без нього — ні."
  },
  {
    question: "Як типізувати функцію з властивостями?",
    code: "fn.version = '1.0';",
    options: [
      "Неможливо",
      "type Fn = (() => void) & { version: string }",
      "interface Fn extends Function",
      "Object.assign"
    ],
    correct: 1,
    explanation: "Intersection type об'єднує callable та об'єкт з властивостями."
  },
  {
    question: "Чи підтримує TS currying автоматично?",
    code: "const add = (a: number) => (b: number) => a + b;",
    options: [
      "Так, з спеціальним синтаксисом",
      "Так, просто вкладені arrow functions",
      "Ні, потрібна бібліотека",
      "Тільки з декораторами"
    ],
    correct: 1,
    explanation: "Currying — просто функція що повертає функцію, TS підтримує."
  }
]
</script>

# Quiz: Функції

Інтерактивний тест з 15 випадкових питань про функції в TypeScript.

<Quiz :questions="questions" :count="15" />
