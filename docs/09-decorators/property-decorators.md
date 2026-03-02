# Декоратори властивостей

Декоратори властивостей дозволяють модифікувати поведінку властивостей класу.

## Синтаксис

```typescript
function PropertyDecorator(
  target: any,        // Прототип класу
  propertyKey: string // Ім'я властивості
) {
  // Модифікація властивості
}

class Example {
  @PropertyDecorator
  myProperty: string;
}
```

::: warning Увага
Декоратор властивості не отримує PropertyDescriptor, тому для модифікації поведінки потрібно використовувати Object.defineProperty.
:::

## Простий приклад

```typescript
function LogProperty(target: any, propertyKey: string) {
  console.log(`Property ${propertyKey} defined on ${target.constructor.name}`);
}

class User {
  @LogProperty
  name: string;

  @LogProperty
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

// Виведе:
// Property name defined on User
// Property age defined on User
```

## Observable — відстеження змін

```typescript
function Observable(target: any, propertyKey: string) {
  let value: any;

  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue) {
      console.log(`${propertyKey} changed from ${value} to ${newValue}`);
      value = newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Observable
  name: string = '';
}

const user = new User();
user.name = 'Anna';  // name changed from undefined to Anna
user.name = 'John';  // name changed from Anna to John
```

## Validate — валідація при присвоєнні

```typescript
function Min(minValue: number) {
  return function(target: any, propertyKey: string) {
    let value: number;

    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (newValue < minValue) {
          throw new Error(`${propertyKey} must be at least ${minValue}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

function Max(maxValue: number) {
  return function(target: any, propertyKey: string) {
    let value: number;

    Object.defineProperty(target, propertyKey, {
      get() {
        return value;
      },
      set(newValue: number) {
        if (newValue > maxValue) {
          throw new Error(`${propertyKey} must be at most ${maxValue}`);
        }
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Product {
  @Min(0)
  @Max(10000)
  price: number = 0;
}

const product = new Product();
product.price = 100;    // ✅ OK
// product.price = -10;  // ❌ Error: price must be at least 0
// product.price = 99999; // ❌ Error: price must be at most 10000
```

## Required — обов'язкове поле

```typescript
const requiredMetadataKey = Symbol('required');

function Required(target: any, propertyKey: string) {
  const existingRequired: string[] = Reflect.getMetadata(requiredMetadataKey, target) || [];
  existingRequired.push(propertyKey);
  Reflect.defineMetadata(requiredMetadataKey, existingRequired, target);
}

function validate(obj: any): boolean {
  const required: string[] = Reflect.getMetadata(requiredMetadataKey, obj) || [];

  for (const prop of required) {
    if (obj[prop] === undefined || obj[prop] === null || obj[prop] === '') {
      throw new Error(`Property ${prop} is required`);
    }
  }

  return true;
}

class User {
  @Required
  name: string = '';

  @Required
  email: string = '';

  age?: number;
}

const user = new User();
user.name = 'Anna';
// validate(user); // ❌ Error: Property email is required
```

## Format — форматування значення

```typescript
function Trim(target: any, propertyKey: string) {
  let value: string;

  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: string) {
      value = typeof newValue === 'string' ? newValue.trim() : newValue;
    },
    enumerable: true,
    configurable: true
  });
}

function Lowercase(target: any, propertyKey: string) {
  let value: string;

  Object.defineProperty(target, propertyKey, {
    get() {
      return value;
    },
    set(newValue: string) {
      value = typeof newValue === 'string' ? newValue.toLowerCase() : newValue;
    },
    enumerable: true,
    configurable: true
  });
}

class User {
  @Trim
  name: string = '';

  @Lowercase
  @Trim
  email: string = '';
}

const user = new User();
user.name = '  Anna  ';
user.email = '  ANNA@EXAMPLE.COM  ';

console.log(user.name);  // 'Anna'
console.log(user.email); // 'anna@example.com'
```

## Default — значення за замовчуванням

```typescript
function Default<T>(defaultValue: T) {
  return function(target: any, propertyKey: string) {
    let value: T | undefined;

    Object.defineProperty(target, propertyKey, {
      get() {
        return value ?? defaultValue;
      },
      set(newValue: T) {
        value = newValue;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class Config {
  @Default('localhost')
  host: string;

  @Default(3000)
  port: number;

  @Default(false)
  debug: boolean;
}

const config = new Config();
console.log(config.host);  // 'localhost'
console.log(config.port);  // 3000
console.log(config.debug); // false

config.port = 8080;
console.log(config.port);  // 8080
```

## Readonly

```typescript
function Readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false
  });
}

class Constants {
  @Readonly
  PI = 3.14159;
}

const constants = new Constants();
// constants.PI = 3; // ❌ Error in strict mode
```

## Lazy — ліниве обчислення

```typescript
function Lazy<T>(initializer: () => T) {
  return function(target: any, propertyKey: string) {
    let value: T;
    let initialized = false;

    Object.defineProperty(target, propertyKey, {
      get() {
        if (!initialized) {
          console.log(`Initializing ${propertyKey}...`);
          value = initializer();
          initialized = true;
        }
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
}

class ExpensiveService {
  @Lazy(() => {
    // Важка операція
    return new Array(1000000).fill(0).map((_, i) => i);
  })
  largeData: number[];
}

const service = new ExpensiveService();
// largeData ще не обчислено

console.log(service.largeData.length); // Initializing largeData... 1000000
console.log(service.largeData.length); // 1000000 (без ініціалізації)
```

## Metadata з reflect-metadata

```typescript
import 'reflect-metadata';

function Type(type: string) {
  return function(target: any, propertyKey: string) {
    Reflect.defineMetadata('design:type', type, target, propertyKey);
  };
}

function getPropertyType(target: any, propertyKey: string): string {
  return Reflect.getMetadata('design:type', target, propertyKey);
}

class User {
  @Type('string')
  name: string;

  @Type('number')
  age: number;
}

const user = new User();
console.log(getPropertyType(user, 'name')); // 'string'
console.log(getPropertyType(user, 'age'));  // 'number'
```

## Практичне завдання

```typescript
// 1. Створи декоратор @Positive для чисел > 0
function Positive(target: any, propertyKey: string) {
  let value: number;

  Object.defineProperty(target, propertyKey, {
    get() { return value; },
    set(newValue: number) {
      if (newValue <= 0) {
        throw new Error(`${propertyKey} must be positive`);
      }
      value = newValue;
    }
  });
}

// 2. Створи декоратор @Email для валідації email
function Email(target: any, propertyKey: string) {
  let value: string;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  Object.defineProperty(target, propertyKey, {
    get() { return value; },
    set(newValue: string) {
      if (!emailRegex.test(newValue)) {
        throw new Error(`${propertyKey} must be a valid email`);
      }
      value = newValue;
    }
  });
}

// 3. Створи декоратор @Encrypted
function Encrypted(target: any, propertyKey: string) {
  let value: string;

  Object.defineProperty(target, propertyKey, {
    get() {
      return atob(value); // Декодування
    },
    set(newValue: string) {
      value = btoa(newValue); // Кодування
    }
  });
}
```

## Висновок

Декоратори властивостей корисні для:
- Валідації значень
- Трансформації даних
- Значень за замовчуванням
- Лінивої ініціалізації
- Спостереження за змінами
- Метаданих (з reflect-metadata)
