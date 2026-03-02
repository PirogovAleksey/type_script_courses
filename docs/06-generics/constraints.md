# Generic Constraints

Обмеження дозволяють звузити типи, з якими працює generic.

## Базові обмеження (extends)

```typescript
// Без обмеження — помилка
function getLength<T>(arg: T): number {
  return arg.length; // ❌ Помилка: властивість length не існує на T
}

// З обмеженням — працює
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length; // ✅ OK
}

getLength('hello');     // 5
getLength([1, 2, 3]);   // 3
getLength({ length: 10 }); // 10
getLength(123);         // ❌ Помилка: number не має length
```

## extends з Interface

```typescript
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

interface User extends HasId {
  name: string;
}

interface Product extends HasId {
  title: string;
  price: number;
}

const users: User[] = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'John' }
];

const user = findById(users, 1); // User | undefined
```

## keyof Constraint

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Anna', age: 25, email: 'anna@example.com' };

const name = getProperty(user, 'name');  // string
const age = getProperty(user, 'age');    // number
getProperty(user, 'invalid');            // ❌ Помилка
```

### Практичний приклад

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

const user = { id: 1, name: 'Anna', email: 'a@b.com', password: 'secret' };
const publicUser = pick(user, ['id', 'name', 'email']);
// { id: number; name: string; email: string }
```

## Множинні обмеження

```typescript
interface HasName {
  name: string;
}

interface HasAge {
  age: number;
}

// T повинен мати і name, і age
function greet<T extends HasName & HasAge>(person: T): string {
  return `Hello, ${person.name}! You are ${person.age} years old.`;
}

greet({ name: 'Anna', age: 25 });               // ✅ OK
greet({ name: 'Anna', age: 25, email: 'a@b' }); // ✅ OK (додаткові поля дозволені)
greet({ name: 'Anna' });                        // ❌ Помилка: немає age
```

## Обмеження з класами

```typescript
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {
  bark(): void {
    console.log('Woof!');
  }
}

class Cat extends Animal {
  meow(): void {
    console.log('Meow!');
  }
}

function createPet<T extends Animal>(PetClass: new (name: string) => T, name: string): T {
  return new PetClass(name);
}

const dog = createPet(Dog, 'Rex');  // Dog
const cat = createPet(Cat, 'Mia');  // Cat

dog.bark(); // ✅ OK
cat.meow(); // ✅ OK
```

## Conditional Constraints

```typescript
type StringOrNumber<T> = T extends string ? string : number;

function process<T extends string | number>(value: T): StringOrNumber<T> {
  if (typeof value === 'string') {
    return value.toUpperCase() as StringOrNumber<T>;
  }
  return (value * 2) as StringOrNumber<T>;
}

const str = process('hello'); // string
const num = process(42);      // number
```

## Обмеження для масивів

```typescript
// Елементи масиву повинні бути порівнюваними
interface Comparable {
  compareTo(other: this): number;
}

function sort<T extends Comparable>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.compareTo(b));
}

// Або простіше
function sortBy<T, K extends keyof T>(arr: T[], key: K): T[] {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

const users = [
  { name: 'John', age: 30 },
  { name: 'Anna', age: 25 }
];

const sortedByAge = sortBy(users, 'age');
const sortedByName = sortBy(users, 'name');
```

## Практичні приклади

### API Client

```typescript
interface ApiEndpoints {
  '/users': { response: User[]; params: { page?: number } };
  '/users/:id': { response: User; params: { id: number } };
  '/posts': { response: Post[]; params: { userId?: number } };
}

async function apiGet<K extends keyof ApiEndpoints>(
  endpoint: K,
  params?: ApiEndpoints[K]['params']
): Promise<ApiEndpoints[K]['response']> {
  const response = await fetch(endpoint);
  return response.json();
}

// TypeScript знає точні типи
const users = await apiGet('/users', { page: 1 }); // User[]
const user = await apiGet('/users/:id', { id: 1 }); // User
```

### Form Validator

```typescript
interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

function createValidator<T extends Record<string, unknown>>(
  rules: { [K in keyof T]?: ValidationRule<T[K]>[] }
) {
  return (data: T): { valid: boolean; errors: Partial<Record<keyof T, string[]>> } => {
    const errors: Partial<Record<keyof T, string[]>> = {};
    let valid = true;

    for (const key in rules) {
      const fieldRules = rules[key];
      if (!fieldRules) continue;

      const fieldErrors: string[] = [];
      for (const rule of fieldRules) {
        if (!rule.validate(data[key])) {
          fieldErrors.push(rule.message);
          valid = false;
        }
      }

      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    }

    return { valid, errors };
  };
}

interface LoginForm {
  email: string;
  password: string;
}

const validateLogin = createValidator<LoginForm>({
  email: [
    { validate: (v) => v.includes('@'), message: 'Invalid email' }
  ],
  password: [
    { validate: (v) => v.length >= 8, message: 'Min 8 characters' }
  ]
});

const result = validateLogin({ email: 'test', password: '123' });
// { valid: false, errors: { email: ['Invalid email'], password: ['Min 8 characters'] } }
```

### Builder with Constraints

```typescript
interface QueryOptions {
  select: string[];
  where?: Record<string, unknown>;
  orderBy?: string;
  limit?: number;
}

class QueryBuilder<T extends Record<string, unknown>> {
  private options: Partial<QueryOptions> = {};

  select<K extends keyof T>(...fields: K[]): this {
    this.options.select = fields as string[];
    return this;
  }

  where<K extends keyof T>(field: K, value: T[K]): this {
    if (!this.options.where) {
      this.options.where = {};
    }
    this.options.where[field as string] = value;
    return this;
  }

  orderBy<K extends keyof T>(field: K): this {
    this.options.orderBy = field as string;
    return this;
  }

  limit(n: number): this {
    this.options.limit = n;
    return this;
  }

  build(): QueryOptions {
    return this.options as QueryOptions;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

const query = new QueryBuilder<User>()
  .select('id', 'name')
  .where('name', 'Anna')
  .orderBy('id')
  .limit(10)
  .build();
```

## Практичне завдання

```typescript
// 1. Створи функцію merge з обмеженнями
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// 2. Створи функцію pluck
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  return arr.map(item => item[key]);
}

// 3. Створи типобезпечну функцію update
function update<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  return { ...obj, [key]: value };
}
```

## Висновок

Constraints роблять generics потужнішими:
- `extends` обмежує можливі типи
- `keyof` забезпечує типобезпечний доступ до властивостей
- Множинні constraints через `&`
- Conditional types для складної логіки
