# Основи класів

TypeScript додає типізацію та додаткові можливості до класів JavaScript.

## Базовий синтаксис

```typescript
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const user = new User('Anna', 25);
console.log(user.greet()); // "Hello, I'm Anna"
```

## Скорочений синтаксис конструктора

TypeScript дозволяє оголошувати властивості прямо в конструкторі:

```typescript
class User {
  constructor(
    public name: string,
    public age: number
  ) {}
  // Властивості name та age створюються автоматично
}

const user = new User('Anna', 25);
console.log(user.name); // "Anna"
```

## Типізація властивостей

```typescript
class Product {
  id: number;
  name: string;
  price: number;
  description?: string;  // Опціонально

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}
```

## Ініціалізація властивостей

### Значення за замовчуванням

```typescript
class Counter {
  count: number = 0;
  step: number = 1;

  increment(): void {
    this.count += this.step;
  }
}
```

### Strict Property Initialization

З `strictPropertyInitialization` TypeScript вимагає ініціалізації:

```typescript
class User {
  name: string;        // ❌ Помилка: не ініціалізовано
  email!: string;      // ✅ ! каже "я ініціалізую пізніше"
  age: number = 0;     // ✅ Значення за замовчуванням
}
```

## Методи

```typescript
class Calculator {
  private result: number = 0;

  add(value: number): this {
    this.result += value;
    return this;
  }

  subtract(value: number): this {
    this.result -= value;
    return this;
  }

  multiply(value: number): this {
    this.result *= value;
    return this;
  }

  getResult(): number {
    return this.result;
  }
}

// Fluent interface
const result = new Calculator()
  .add(10)
  .multiply(2)
  .subtract(5)
  .getResult(); // 15
```

## Getters та Setters

```typescript
class User {
  private _age: number = 0;

  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) {
      throw new Error('Age cannot be negative');
    }
    this._age = value;
  }
}

const user = new User();
user.age = 25;        // Викликає setter
console.log(user.age); // Викликає getter: 25
user.age = -5;        // Помилка!
```

### Readonly getter

```typescript
class Circle {
  constructor(public radius: number) {}

  get area(): number {
    return Math.PI * this.radius ** 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle(5);
console.log(circle.area);          // 78.54...
console.log(circle.circumference); // 31.42...
```

## Статичні члени

```typescript
class MathUtils {
  static PI = 3.14159;

  static square(n: number): number {
    return n * n;
  }

  static cube(n: number): number {
    return n * n * n;
  }
}

console.log(MathUtils.PI);        // 3.14159
console.log(MathUtils.square(4)); // 16
console.log(MathUtils.cube(3));   // 27
```

### Static blocks (ES2022)

```typescript
class Config {
  static settings: Map<string, string>;

  static {
    this.settings = new Map();
    this.settings.set('debug', 'false');
    this.settings.set('version', '1.0.0');
  }
}
```

## Наслідування

```typescript
class Animal {
  constructor(public name: string) {}

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name);
  }

  speak(): void {
    console.log(`${this.name} barks`);
  }

  fetch(): void {
    console.log(`${this.name} fetches the ball`);
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak(); // "Rex barks"
dog.fetch(); // "Rex fetches the ball"
```

### super keyword

```typescript
class Parent {
  greet(): string {
    return 'Hello from Parent';
  }
}

class Child extends Parent {
  greet(): string {
    const parentGreeting = super.greet();
    return `${parentGreeting} and Child`;
  }
}

const child = new Child();
console.log(child.greet()); // "Hello from Parent and Child"
```

## Implements Interface

```typescript
interface Printable {
  print(): void;
}

interface Serializable {
  serialize(): string;
}

class Document implements Printable, Serializable {
  constructor(public content: string) {}

  print(): void {
    console.log(this.content);
  }

  serialize(): string {
    return JSON.stringify({ content: this.content });
  }
}
```

## Практичні приклади

### Repository Pattern

```typescript
interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

interface User extends Entity {
  name: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: 'Anna' });
```

### Builder Pattern

```typescript
class QueryBuilder {
  private query: string[] = [];

  select(fields: string[]): this {
    this.query.push(`SELECT ${fields.join(', ')}`);
    return this;
  }

  from(table: string): this {
    this.query.push(`FROM ${table}`);
    return this;
  }

  where(condition: string): this {
    this.query.push(`WHERE ${condition}`);
    return this;
  }

  build(): string {
    return this.query.join(' ');
  }
}

const query = new QueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('active = true')
  .build();
// "SELECT id, name, email FROM users WHERE active = true"
```

## Практичне завдання

```typescript
// 1. Створи клас BankAccount
class BankAccount {
  private balance: number = 0;

  constructor(public owner: string, initialBalance: number = 0) {
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    if (amount > 0) this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) return false;
    this.balance -= amount;
    return true;
  }

  getBalance(): number {
    return this.balance;
  }
}

// 2. Створи клас SavingsAccount, що розширює BankAccount
class SavingsAccount extends BankAccount {
  constructor(
    owner: string,
    initialBalance: number,
    public interestRate: number
  ) {
    super(owner, initialBalance);
  }

  addInterest(): void {
    const interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
  }
}
```

## Висновок

Класи в TypeScript — потужний інструмент для ООП. Вони підтримують типізацію, модифікатори доступу, наслідування та інтерфейси. У наступному уроці розглянемо модифікатори доступу детальніше.
