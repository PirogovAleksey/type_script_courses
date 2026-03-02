<script setup>
const questions = [
  {
    question: "Що таке модифікатор private?",
    options: [
      "Доступ тільки в класі",
      "Доступ в класі та підкласах",
      "Доступ всюди",
      "Доступ тільки в модулі"
    ],
    correct: 0,
    explanation: "private обмежує доступ тільки всередині класу."
  },
  {
    question: "Що таке protected?",
    options: [
      "Доступ тільки в класі",
      "Доступ в класі та підкласах",
      "Доступ всюди",
      "Readonly доступ"
    ],
    correct: 1,
    explanation: "protected дозволяє доступ в класі та всіх підкласах."
  },
  {
    question: "Яка різниця між private та #?",
    code: "class A { private x = 1; }\nclass B { #y = 2; }",
    options: [
      "Немає різниці",
      "private — compile-time, # — runtime",
      "# застаріле",
      "private швидше"
    ],
    correct: 1,
    explanation: "# — справжня приватність в runtime, private — тільки TS перевірка."
  },
  {
    question: "Чи можна обійти private?",
    code: "(obj as any).privateField",
    options: [
      "Ні, неможливо",
      "Так, через type assertion",
      "Тільки в тестах",
      "Залежить від strict"
    ],
    correct: 1,
    explanation: "private перевіряється тільки TS, в runtime можна обійти через any."
  },
  {
    question: "Що робить readonly?",
    code: "class User { readonly id: number; }",
    options: [
      "Не можна читати",
      "Не можна змінювати після ініціалізації",
      "Тільки в constructor",
      "Приватний доступ"
    ],
    correct: 1,
    explanation: "readonly дозволяє присвоїти тільки в constructor або при оголошенні."
  },
  {
    question: "Що таке абстрактний клас?",
    code: "abstract class Shape { abstract area(): number; }",
    options: [
      "Клас без методів",
      "Клас що не можна інстанціювати напряму",
      "Застарілий клас",
      "Private клас"
    ],
    correct: 1,
    explanation: "abstract class — шаблон для підкласів, не можна створити new."
  },
  {
    question: "Чи можна мати реалізацію в abstract class?",
    code: "abstract class A { abstract x(): void; y() { } }",
    options: [
      "Ні, тільки abstract методи",
      "Так, можна мати і abstract, і звичайні",
      "Тільки static",
      "Тільки private"
    ],
    correct: 1,
    explanation: "Abstract class може мати як abstract, так і звичайні методи."
  },
  {
    question: "Що робить implements?",
    code: "class User implements Printable { }",
    options: [
      "Наслідує клас",
      "Реалізує інтерфейс (контракт)",
      "Розширює тип",
      "Імпортує модуль"
    ],
    correct: 1,
    explanation: "implements вимагає реалізувати всі методи/властивості інтерфейсу."
  },
  {
    question: "Скільки інтерфейсів можна implements?",
    code: "class A implements B, C, D { }",
    options: [
      "Тільки один",
      "Максимум два",
      "Необмежено",
      "Залежить від версії"
    ],
    correct: 2,
    explanation: "Клас може реалізувати будь-яку кількість інтерфейсів."
  },
  {
    question: "Скільки класів можна extends?",
    code: "class A extends B, C { }",
    options: [
      "Тільки один",
      "Необмежено",
      "Два",
      "Залежить від модифікаторів"
    ],
    correct: 0,
    explanation: "TypeScript (як і JS) підтримує тільки single inheritance."
  },
  {
    question: "Що таке static?",
    code: "class Math { static PI = 3.14; }",
    options: [
      "Властивість екземпляра",
      "Властивість класу (без new)",
      "Незмінна властивість",
      "Private властивість"
    ],
    correct: 1,
    explanation: "static належить класу, не екземпляру. Доступ: Math.PI."
  },
  {
    question: "Чи є this в static методі?",
    code: "class A { static x = 1; static getX() { return this.x; } }",
    options: [
      "Ні, помилка",
      "Так, this вказує на клас",
      "Так, this вказує на екземпляр",
      "Тільки з bind"
    ],
    correct: 1,
    explanation: "В static методах this вказує на клас, не на екземпляр."
  },
  {
    question: "Що таке getter?",
    code: "class C { get value() { return this._value; } }",
    options: [
      "Метод для отримання значення",
      "Властивість-accessor",
      "Private метод",
      "Constructor"
    ],
    correct: 1,
    explanation: "getter виглядає як властивість, але викликає функцію."
  },
  {
    question: "Чи можна мати getter без setter?",
    options: [
      "Ні, обов'язково обидва",
      "Так, буде readonly властивість",
      "Тільки з private",
      "Помилка компіляції"
    ],
    correct: 1,
    explanation: "getter без setter створює readonly accessor."
  },
  {
    question: "Що таке parameter property?",
    code: "class User { constructor(public name: string) {} }",
    options: [
      "Помилка синтаксису",
      "Скорочення для оголошення властивості",
      "Тільки для private",
      "Тільки для readonly"
    ],
    correct: 1,
    explanation: "public/private/readonly в конструкторі автоматично створює властивість."
  },
  {
    question: "Чи обов'язковий super() в підкласі?",
    code: "class B extends A { constructor() { } }",
    options: [
      "Ні, опціонально",
      "Так, обов'язково викликати super() першим",
      "Тільки якщо A має constructor",
      "Тільки з параметрами"
    ],
    correct: 1,
    explanation: "super() обов'язковий в constructor підкласу перед this."
  },
  {
    question: "Що таке override?",
    code: "class B extends A { override method() {} }",
    options: [
      "Обов'язкове ключове слово",
      "Явна вказівка що перевизначаємо метод батька",
      "Застаріле",
      "Синонім super"
    ],
    correct: 1,
    explanation: "override допомагає уникнути помилок при перевизначенні."
  },
  {
    question: "Чи можна private в interface?",
    code: "interface A { private x: number; }",
    options: [
      "Так",
      "Ні, interface тільки public контракт",
      "Тільки protected",
      "Залежить від strict"
    ],
    correct: 1,
    explanation: "Interface описує публічний API, модифікатори доступу не дозволені."
  },
  {
    question: "Що таке Singleton pattern?",
    code: "class S { private static instance: S; private constructor() {} }",
    options: [
      "Клас з одним методом",
      "Клас з одним екземпляром",
      "Abstract клас",
      "Static клас"
    ],
    correct: 1,
    explanation: "Singleton гарантує тільки один екземпляр класу."
  },
  {
    question: "Як реалізувати Singleton?",
    options: [
      "private constructor + static getInstance()",
      "abstract class",
      "readonly class",
      "sealed class"
    ],
    correct: 0,
    explanation: "Private constructor забороняє new, getInstance() повертає єдиний instance."
  },
  {
    question: "Що таке mixin?",
    options: [
      "Спосіб композиції поведінки без наслідування",
      "Тип змішаного масиву",
      "Abstract method",
      "Interface implementation"
    ],
    correct: 0,
    explanation: "Mixin — спосіб додати функціональність без extends."
  },
  {
    question: "Яка видимість за замовчуванням?",
    code: "class A { x = 1; }",
    options: [
      "private",
      "protected",
      "public",
      "internal"
    ],
    correct: 2,
    explanation: "Без модифікатора властивість public."
  },
  {
    question: "Чи можна перевизначити private метод?",
    code: "class A { private x() {} }\nclass B extends A { private x() {} }",
    options: [
      "Так, це override",
      "Ні, це новий метод в B",
      "Помилка компіляції",
      "Тільки з override"
    ],
    correct: 1,
    explanation: "private методи не успадковуються, x() в B — це новий метод."
  },
  {
    question: "Чи можна protected зробити public в підкласі?",
    code: "class A { protected x = 1; }\nclass B extends A { public x = 1; }",
    options: [
      "Ні, не можна розширювати видимість",
      "Так, можна розширювати видимість",
      "Тільки з override",
      "Помилка"
    ],
    correct: 1,
    explanation: "Видимість можна розширювати (protected → public), але не звужувати."
  },
  {
    question: "Що таке abstract property?",
    code: "abstract class A { abstract name: string; }",
    options: [
      "Властивість без значення",
      "Властивість що підклас повинен реалізувати",
      "Private властивість",
      "Помилка синтаксису"
    ],
    correct: 1,
    explanation: "abstract property вимагає реалізації в підкласі."
  },
  {
    question: "Чи може constructor бути private?",
    code: "class A { private constructor() {} }",
    options: [
      "Ні, constructor завжди public",
      "Так, для Singleton або factory",
      "Тільки protected",
      "Помилка"
    ],
    correct: 1,
    explanation: "Private constructor забороняє створення через new ззовні."
  },
  {
    question: "Що таке method chaining?",
    code: "obj.setA(1).setB(2).build()",
    options: [
      "Виклик методів підряд",
      "Методи повертають this для ланцюжка",
      "Async/await",
      "Decorator pattern"
    ],
    correct: 1,
    explanation: "Методи повертають this, дозволяючи викликати наступний метод."
  },
  {
    question: "Як типізувати this для chaining?",
    code: "class A { setX(x: number): ??? { this.x = x; return this; } }",
    options: [
      "A",
      "this",
      "typeof this",
      "self"
    ],
    correct: 1,
    explanation: "Повернення this зберігає тип для підкласів."
  },
  {
    question: "Чи можна static і abstract разом?",
    code: "abstract class A { abstract static x: number; }",
    options: [
      "Так",
      "Ні, static не може бути abstract",
      "Тільки для методів",
      "Залежить від версії"
    ],
    correct: 1,
    explanation: "static та abstract несумісні — static належить класу, не екземпляру."
  },
  {
    question: "Що таке declaration merging для класів?",
    code: "class A {}\ninterface A { x: number; }",
    options: [
      "Помилка — дублювання імені",
      "A отримає властивість x",
      "Interface ігнорується",
      "Class ігнорується"
    ],
    correct: 1,
    explanation: "Interface з тим же ім'ям розширює клас (declaration merging)."
  }
]
</script>

# Quiz: Класи

Інтерактивний тест з 15 випадкових питань про класи в TypeScript.

<Quiz :questions="questions" :count="15" />
