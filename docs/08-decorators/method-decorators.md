# Декоратори методів

Декоратор методу дозволяє модифікувати поведінку методу класу.

## Синтаксис

```typescript
function MethodDecorator(
  target: any,                      // Прототип класу (або конструктор для static)
  propertyKey: string,              // Ім'я методу
  descriptor: PropertyDescriptor    // Дескриптор властивості
) {
  // Модифікація методу
}

class Example {
  @MethodDecorator
  myMethod() {}
}
```

## PropertyDescriptor

```typescript
interface PropertyDescriptor {
  value?: any;           // Сама функція
  writable?: boolean;    // Чи можна перезаписати
  enumerable?: boolean;  // Чи видимий в for...in
  configurable?: boolean; // Чи можна видалити/змінити
  get?: () => any;       // Getter
  set?: (v: any) => void; // Setter
}
```

## Простий логер

```typescript
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);
// Calling add with args: [2, 3]
// Result: 5
```

## Декоратор з параметрами

```typescript
function Log(prefix: string) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      console.log(`[${prefix}] ${propertyKey}(${args.join(', ')})`);
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

class UserService {
  @Log('DEBUG')
  createUser(name: string) {
    return { name };
  }

  @Log('INFO')
  deleteUser(id: number) {
    return true;
  }
}
```

## Timing — вимірювання часу

```typescript
function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function(...args: any[]) {
    const start = performance.now();
    const result = await originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${(end - start).toFixed(2)}ms`);
    return result;
  };

  return descriptor;
}

class DataService {
  @Timing
  async fetchData() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { data: 'loaded' };
  }
}

const service = new DataService();
await service.fetchData();
// fetchData took 100.23ms
```

## Memoize — кешування результатів

```typescript
function Memoize(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map<string, any>();

  descriptor.value = function(...args: any[]) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${propertyKey}(${key})`);
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

class MathService {
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const math = new MathService();
console.log(math.fibonacci(40)); // Швидко завдяки кешуванню
```

## Debounce

```typescript
function Debounce(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let timeoutId: ReturnType<typeof setTimeout>;

    descriptor.value = function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, ms);
    };

    return descriptor;
  };
}

class SearchService {
  @Debounce(300)
  search(query: string) {
    console.log(`Searching for: ${query}`);
  }
}

const search = new SearchService();
search.search('a');
search.search('ab');
search.search('abc'); // Тільки цей виклик виконається через 300ms
```

## Retry — повторні спроби

```typescript
function Retry(attempts: number, delay: number = 1000) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let lastError: Error;

      for (let i = 0; i < attempts; i++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.log(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

class ApiClient {
  private failCount = 0;

  @Retry(3, 500)
  async fetchData() {
    this.failCount++;
    if (this.failCount < 3) {
      throw new Error('Network error');
    }
    return { success: true };
  }
}
```

## Validate — валідація аргументів

```typescript
function ValidateArgs(...validators: ((arg: any) => boolean)[]) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      validators.forEach((validator, index) => {
        if (!validator(args[index])) {
          throw new Error(`Invalid argument at position ${index}`);
        }
      });

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

const isString = (v: any) => typeof v === 'string';
const isPositive = (v: any) => typeof v === 'number' && v > 0;

class ProductService {
  @ValidateArgs(isString, isPositive)
  createProduct(name: string, price: number) {
    return { name, price };
  }
}

const products = new ProductService();
products.createProduct('Laptop', 999);  // ✅ OK
// products.createProduct('', -10);      // ❌ Error
```

## Readonly

```typescript
function Readonly(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Config {
  @Readonly
  getVersion() {
    return '1.0.0';
  }
}

const config = new Config();
// config.getVersion = () => '2.0.0'; // ❌ Error in strict mode
```

## Практичне завдання

```typescript
// 1. Створи декоратор @Throttle(ms)
function Throttle(ms: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    let lastCall = 0;

    descriptor.value = function(...args: any[]) {
      const now = Date.now();
      if (now - lastCall >= ms) {
        lastCall = now;
        return originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

// 2. Створи декоратор @Catch що ловить помилки
function Catch(errorHandler: (error: Error) => void) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        errorHandler(error as Error);
      }
    };

    return descriptor;
  };
}

// 3. Створи декоратор @Bind що прив'язує this
function Bind(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  return {
    configurable: true,
    get() {
      return originalMethod.bind(this);
    }
  };
}
```

## Висновок

Декоратори методів ідеальні для:
- Логування та профілювання
- Кешування (memoization)
- Rate limiting (debounce, throttle)
- Retry логіки
- Валідації
- Error handling
