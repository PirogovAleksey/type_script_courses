# Абстрактні класи

Абстрактний клас — шаблон для інших класів, який не можна інстанціювати напряму.

## Базовий синтаксис

```typescript
abstract class Animal {
  constructor(public name: string) {}

  // Абстрактний метод — без реалізації
  abstract makeSound(): void;

  // Звичайний метод — з реалізацією
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

// ❌ Не можна створити екземпляр
const animal = new Animal('Generic'); // Помилка!

// ✅ Потрібно наслідувати та реалізувати абстрактні методи
class Dog extends Animal {
  makeSound(): void {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Rex');
dog.makeSound(); // "Rex barks"
dog.move();      // "Rex is moving"
```

## Абстрактні властивості

```typescript
abstract class Shape {
  abstract readonly name: string;
  abstract area: number;

  describe(): string {
    return `${this.name} with area ${this.area}`;
  }
}

class Circle extends Shape {
  readonly name = 'Circle';

  constructor(public radius: number) {
    super();
  }

  get area(): number {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  readonly name = 'Rectangle';

  constructor(public width: number, public height: number) {
    super();
  }

  get area(): number {
    return this.width * this.height;
  }
}
```

## Комбінування з модифікаторами

```typescript
abstract class BaseService {
  protected abstract apiUrl: string;

  protected async fetchData<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.apiUrl}${endpoint}`);
    return response.json();
  }

  abstract getData(): Promise<unknown>;
}

class UserService extends BaseService {
  protected apiUrl = 'https://api.example.com';

  async getData(): Promise<User[]> {
    return this.fetchData<User[]>('/users');
  }
}
```

## Abstract vs Interface

### Interface — контракт

```typescript
interface Printable {
  print(): void;
}

// Клас може імплементувати багато інтерфейсів
class Document implements Printable {
  print(): void {
    console.log('Printing document...');
  }
}
```

### Abstract — шаблон з частковою реалізацією

```typescript
abstract class Printable {
  abstract print(): void;

  // Може мати реалізацію
  printWithHeader(): void {
    console.log('=== Document ===');
    this.print();
  }
}

// Клас може наслідувати тільки один абстрактний клас
class Document extends Printable {
  print(): void {
    console.log('Document content');
  }
}
```

### Порівняння

| Аспект | Interface | Abstract Class |
|--------|-----------|----------------|
| Множинне наслідування | ✅ | ❌ |
| Реалізація методів | ❌ | ✅ |
| Властивості | ❌ | ✅ |
| Конструктор | ❌ | ✅ |
| Модифікатори доступу | ❌ | ✅ |

## Практичні приклади

### Template Method Pattern

```typescript
abstract class DataProcessor<T, R> {
  // Template method
  process(data: T): R {
    const validated = this.validate(data);
    const transformed = this.transform(validated);
    return this.format(transformed);
  }

  // Кроки для реалізації в підкласах
  protected abstract validate(data: T): T;
  protected abstract transform(data: T): R;

  // Опціональний крок з базовою реалізацією
  protected format(data: R): R {
    return data;
  }
}

interface RawUser {
  name: string;
  email: string;
}

interface ProcessedUser {
  fullName: string;
  emailDomain: string;
}

class UserProcessor extends DataProcessor<RawUser, ProcessedUser> {
  protected validate(data: RawUser): RawUser {
    if (!data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    return data;
  }

  protected transform(data: RawUser): ProcessedUser {
    return {
      fullName: data.name.toUpperCase(),
      emailDomain: data.email.split('@')[1]
    };
  }
}
```

### Repository Pattern

```typescript
abstract class BaseRepository<T extends { id: number }> {
  protected items: T[] = [];

  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  findAll(): T[] {
    return [...this.items];
  }

  save(item: T): void {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index !== -1) {
      this.items[index] = item;
    } else {
      this.items.push(item);
    }
  }

  delete(id: number): boolean {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  // Абстрактний метод для валідації
  protected abstract validate(item: T): boolean;
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

  // Додатковий метод для продуктів
  findByPriceRange(min: number, max: number): Product[] {
    return this.items.filter(p => p.price >= min && p.price <= max);
  }
}
```

### Abstract Factory

```typescript
abstract class UIFactory {
  abstract createButton(): Button;
  abstract createInput(): Input;
  abstract createModal(): Modal;
}

interface Button {
  render(): string;
  onClick(handler: () => void): void;
}

interface Input {
  render(): string;
  getValue(): string;
}

interface Modal {
  render(): string;
  open(): void;
  close(): void;
}

class MaterialUIFactory extends UIFactory {
  createButton(): Button {
    return new MaterialButton();
  }

  createInput(): Input {
    return new MaterialInput();
  }

  createModal(): Modal {
    return new MaterialModal();
  }
}

class BootstrapFactory extends UIFactory {
  createButton(): Button {
    return new BootstrapButton();
  }

  createInput(): Input {
    return new BootstrapInput();
  }

  createModal(): Modal {
    return new BootstrapModal();
  }
}

// Використання
function createUI(factory: UIFactory) {
  const button = factory.createButton();
  const input = factory.createInput();
  return { button, input };
}
```

### Middleware Pattern

```typescript
abstract class Middleware<T> {
  private next?: Middleware<T>;

  setNext(middleware: Middleware<T>): Middleware<T> {
    this.next = middleware;
    return middleware;
  }

  handle(request: T): T | null {
    const result = this.process(request);
    if (result === null) {
      return null; // Зупинити ланцюжок
    }
    if (this.next) {
      return this.next.handle(result);
    }
    return result;
  }

  protected abstract process(request: T): T | null;
}

interface Request {
  user?: { id: number; role: string };
  body: unknown;
}

class AuthMiddleware extends Middleware<Request> {
  protected process(request: Request): Request | null {
    if (!request.user) {
      console.log('Unauthorized');
      return null;
    }
    return request;
  }
}

class AdminMiddleware extends Middleware<Request> {
  protected process(request: Request): Request | null {
    if (request.user?.role !== 'admin') {
      console.log('Forbidden');
      return null;
    }
    return request;
  }
}

// Використання
const auth = new AuthMiddleware();
const admin = new AdminMiddleware();
auth.setNext(admin);

auth.handle({ user: { id: 1, role: 'admin' }, body: {} });
```

## Практичне завдання

```typescript
// 1. Створи абстрактний клас для сховища
abstract class Storage<T> {
  abstract save(key: string, value: T): void;
  abstract get(key: string): T | null;
  abstract remove(key: string): void;
  abstract clear(): void;
}

// 2. Реалізуй LocalStorage версію
class LocalStorageAdapter extends Storage<string> {
  save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

// 3. Реалізуй Memory версію
class MemoryStorage<T> extends Storage<T> {
  private data = new Map<string, T>();

  save(key: string, value: T): void {
    this.data.set(key, value);
  }

  get(key: string): T | null {
    return this.data.get(key) ?? null;
  }

  remove(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}
```

## Висновок

Абстрактні класи корисні, коли:
- Потрібна часткова реалізація
- Є спільна логіка для підкласів
- Потрібен Template Method pattern
- Потрібні protected властивості та методи

Використовуй interface для простих контрактів, abstract class — для шаблонів з логікою.
