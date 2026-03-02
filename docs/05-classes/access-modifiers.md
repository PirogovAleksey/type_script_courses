# Модифікатори доступу

TypeScript додає модифікатори `public`, `private`, `protected` та `readonly`.

## public (за замовчуванням)

Доступний всюди:

```typescript
class User {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  public greet(): string {
    return `Hello, ${this.name}`;
  }
}

const user = new User('Anna');
console.log(user.name);    // ✅ OK
console.log(user.greet()); // ✅ OK
```

## private

Доступний тільки всередині класу:

```typescript
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }
}

const account = new BankAccount();
account.deposit(100);
console.log(account.getBalance()); // ✅ OK: 100
console.log(account.balance);      // ❌ Помилка: private
```

### Private методи

```typescript
class PaymentProcessor {
  processPayment(amount: number): boolean {
    if (!this.validateAmount(amount)) {
      return false;
    }
    return this.executePayment(amount);
  }

  private validateAmount(amount: number): boolean {
    return amount > 0 && amount < 10000;
  }

  private executePayment(amount: number): boolean {
    console.log(`Processing $${amount}`);
    return true;
  }
}

const processor = new PaymentProcessor();
processor.processPayment(100);    // ✅ OK
processor.validateAmount(100);    // ❌ Помилка: private
```

## protected

Доступний в класі та підкласах:

```typescript
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected makeSound(): void {
    console.log('Some sound');
  }
}

class Dog extends Animal {
  bark(): void {
    console.log(`${this.name} says woof!`); // ✅ OK: protected доступний
    this.makeSound(); // ✅ OK
  }
}

const dog = new Dog('Rex');
dog.bark();        // ✅ OK
dog.name;          // ❌ Помилка: protected
dog.makeSound();   // ❌ Помилка: protected
```

## readonly

Властивість не можна змінювати після ініціалізації:

```typescript
class Config {
  readonly apiUrl: string;
  readonly version: string = '1.0.0';

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
}

const config = new Config('https://api.example.com');
console.log(config.apiUrl);  // ✅ OK
config.apiUrl = 'new-url';   // ❌ Помилка: readonly
```

### Комбінування з іншими модифікаторами

```typescript
class User {
  public readonly id: number;
  private readonly createdAt: Date;

  constructor(id: number) {
    this.id = id;
    this.createdAt = new Date();
  }
}
```

## # Private fields (ECMAScript)

Справжні приватні поля (runtime enforcement):

```typescript
class Counter {
  #count = 0;  // Справді приватний

  increment(): void {
    this.#count++;
  }

  getCount(): number {
    return this.#count;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount()); // 1
console.log(counter.#count);     // ❌ Синтаксична помилка
```

### private vs #

| Аспект | private | # (ECMAScript) |
|--------|---------|----------------|
| Перевірка | Compile-time | Runtime |
| Доступ через type assertion | Можливий | Неможливий |
| Наслідування | Видимий в підкласах | Повністю приватний |

```typescript
class Example {
  private tsPrivate = 'TypeScript private';
  #realPrivate = 'ECMAScript private';
}

const ex = new Example();
(ex as any).tsPrivate;    // Працює (обхід)
(ex as any).#realPrivate; // ❌ Синтаксична помилка
```

## Скорочений синтаксис

```typescript
class User {
  constructor(
    public readonly id: number,
    public name: string,
    private email: string,
    protected role: string = 'user'
  ) {}
}

// Еквівалентно:
class UserVerbose {
  public readonly id: number;
  public name: string;
  private email: string;
  protected role: string;

  constructor(id: number, name: string, email: string, role: string = 'user') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
```

## Порівняння модифікаторів

| Модифікатор | Клас | Підкласи | Зовні |
|-------------|------|----------|-------|
| public | ✅ | ✅ | ✅ |
| protected | ✅ | ✅ | ❌ |
| private | ✅ | ❌ | ❌ |
| # | ✅ | ❌ | ❌ |

## Практичні приклади

### Інкапсуляція

```typescript
class UserService {
  private users: Map<number, User> = new Map();
  private nextId: number = 1;

  createUser(name: string, email: string): User {
    const user = {
      id: this.nextId++,
      name,
      email
    };
    this.users.set(user.id, user);
    return user;
  }

  findUser(id: number): User | undefined {
    return this.users.get(id);
  }

  // Приватний метод для внутрішнього використання
  private validateEmail(email: string): boolean {
    return email.includes('@');
  }
}
```

### Protected для розширення

```typescript
abstract class BaseRepository<T> {
  protected items: T[] = [];

  protected abstract validate(item: T): boolean;

  add(item: T): void {
    if (this.validate(item)) {
      this.items.push(item);
    }
  }

  getAll(): T[] {
    return [...this.items];
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

class ProductRepository extends BaseRepository<Product> {
  protected validate(product: Product): boolean {
    return product.price > 0 && product.name.length > 0;
  }
}
```

### Singleton Pattern

```typescript
class Database {
  private static instance: Database;
  private constructor() {}  // Приватний конструктор

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true — один екземпляр
```

## Практичне завдання

```typescript
// 1. Створи клас з правильними модифікаторами
class Employee {
  constructor(
    public readonly id: number,
    public name: string,
    private salary: number,
    protected department: string
  ) {}

  getSalary(): number {
    return this.salary;
  }

  private calculateBonus(): number {
    return this.salary * 0.1;
  }

  getTotalCompensation(): number {
    return this.salary + this.calculateBonus();
  }
}

// 2. Розшир клас
class Manager extends Employee {
  private teamSize: number = 0;

  constructor(id: number, name: string, salary: number) {
    super(id, name, salary, 'Management');
  }

  setTeamSize(size: number): void {
    this.teamSize = size;
  }

  getDepartmentInfo(): string {
    return `${this.name} manages ${this.teamSize} people in ${this.department}`;
  }
}
```

## Висновок

- `public` — доступ всюди (за замовчуванням)
- `private` — тільки в класі (compile-time)
- `protected` — в класі та підкласах
- `readonly` — не можна змінювати після ініціалізації
- `#` — справді приватний (runtime)

У наступному уроці розглянемо абстрактні класи.
