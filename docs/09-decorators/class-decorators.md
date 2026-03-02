# Декоратори класів

Декоратор класу застосовується до конструктора класу і може модифікувати або замінити його.

## Базовий синтаксис

```typescript
function ClassDecorator(constructor: Function) {
  // Модифікація або заміна конструктора
}

@ClassDecorator
class MyClass {}
```

## Простий логер

```typescript
function Logger(constructor: Function) {
  console.log(`[LOG] Клас створено: ${constructor.name}`);
  console.log(`[LOG] Кількість властивостей: ${Object.keys(constructor.prototype).length}`);
}

@Logger
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

// Виведе:
// [LOG] Клас створено: User
// [LOG] Кількість властивостей: 1
```

## Декоратор з параметрами

```typescript
function Logger(prefix: string) {
  return function(constructor: Function) {
    console.log(`${prefix}: ${constructor.name}`);
  };
}

@Logger('🚀 Initialized')
class App {
  start() {
    console.log('App started');
  }
}

// Виведе: "🚀 Initialized: App"
```

## Заміна конструктора

Декоратор може повернути новий конструктор:

```typescript
function Timestamped<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    createdAt = new Date();
  };
}

@Timestamped
class Document {
  constructor(public title: string) {}
}

const doc = new Document('Report');
console.log((doc as any).createdAt); // Поточна дата
```

## Sealed — заборона розширення

```typescript
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@Sealed
class Config {
  static version = '1.0.0';

  getValue(key: string) {
    return key;
  }
}

// Спроба додати властивість не працює
// Config.newProp = 'value'; // Помилка в strict mode
```

## Singleton Pattern

```typescript
function Singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T;

  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) {
        return instance;
      }
      super(...args);
      instance = this as any;
    }
  } as T;
}

@Singleton
class Database {
  constructor(public connectionString: string) {
    console.log('Connecting to database...');
  }
}

const db1 = new Database('postgres://localhost');
const db2 = new Database('mysql://localhost');

console.log(db1 === db2); // true
console.log(db2.connectionString); // 'postgres://localhost'
```

## Автоматична реєстрація

```typescript
const registry: Map<string, Function> = new Map();

function Register(name: string) {
  return function(constructor: Function) {
    registry.set(name, constructor);
  };
}

@Register('user-service')
class UserService {
  getUsers() {
    return ['Anna', 'John'];
  }
}

@Register('auth-service')
class AuthService {
  login() {
    return true;
  }
}

// Отримання з реєстру
const UserServiceClass = registry.get('user-service');
const service = new (UserServiceClass as any)();
console.log(service.getUsers()); // ['Anna', 'John']
```

## Mixin через декоратори

```typescript
function Mixin(...mixins: Function[]) {
  return function(constructor: Function) {
    mixins.forEach(mixin => {
      Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
        if (name !== 'constructor') {
          constructor.prototype[name] = mixin.prototype[name];
        }
      });
    });
  };
}

class Loggable {
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

class Serializable {
  serialize() {
    return JSON.stringify(this);
  }
}

@Mixin(Loggable, Serializable)
class User {
  constructor(public name: string, public age: number) {}
}

interface User extends Loggable, Serializable {}

const user = new User('Anna', 25);
user.log('User created');           // [LOG]: User created
console.log(user.serialize());       // {"name":"Anna","age":25}
```

## Валідація схеми

```typescript
interface SchemaDefinition {
  [key: string]: 'string' | 'number' | 'boolean';
}

function Schema(definition: SchemaDefinition) {
  return function<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);

        for (const [key, type] of Object.entries(definition)) {
          const value = (this as any)[key];
          if (typeof value !== type) {
            throw new Error(`Property ${key} must be ${type}, got ${typeof value}`);
          }
        }
      }
    };
  };
}

@Schema({
  name: 'string',
  age: 'number',
  active: 'boolean'
})
class User {
  constructor(
    public name: string,
    public age: number,
    public active: boolean
  ) {}
}

const user = new User('Anna', 25, true);      // ✅ OK
// const invalid = new User('Anna', '25', true); // ❌ Error
```

## Практичне завдання

```typescript
// 1. Створи декоратор @Frozen, що робить клас immutable
function Frozen<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      Object.freeze(this);
    }
  };
}

// 2. Створи декоратор @Deprecated з повідомленням
function Deprecated(message: string) {
  return function(constructor: Function) {
    console.warn(`DEPRECATED: ${constructor.name} - ${message}`);
  };
}

// 3. Створи декоратор @Tracked, що логує створення екземплярів
function Tracked<T extends { new(...args: any[]): {} }>(constructor: T) {
  let count = 0;

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      count++;
      console.log(`Instance #${count} of ${constructor.name} created`);
    }

    static getInstanceCount() {
      return count;
    }
  };
}
```

## Висновок

Декоратори класів дозволяють:
- Модифікувати конструктор
- Додавати властивості та методи
- Реєструвати класи
- Реалізовувати патерни (Singleton, Mixin)
- Валідувати дані
