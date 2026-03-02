# Вступ до декораторів

Декоратори — спеціальний синтаксис для модифікації класів, методів, властивостей та параметрів.

## Що таке декоратори?

Декоратор — це функція, яка додає метадані або змінює поведінку елемента, до якого застосовується.

```typescript
@decorator
class MyClass {
  @propertyDecorator
  myProperty: string;

  @methodDecorator
  myMethod() {}
}
```

## Увімкнення декораторів

Декоратори — експериментальна функція. Для використання увімкни в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Типи декораторів

| Тип | Застосовується до | Аргументи |
|-----|-------------------|-----------|
| Class | Класу | constructor |
| Method | Методу | target, propertyKey, descriptor |
| Property | Властивості | target, propertyKey |
| Parameter | Параметра | target, propertyKey, parameterIndex |
| Accessor | Getter/Setter | target, propertyKey, descriptor |

## Простий приклад

```typescript
// Декоратор класу
function Logger(constructor: Function) {
  console.log(`Клас ${constructor.name} створено`);
}

@Logger
class User {
  constructor(public name: string) {}
}

// Виведе: "Клас User створено"
const user = new User('Anna');
```

## Фабрика декораторів

Декоратор з параметрами:

```typescript
function Logger(prefix: string) {
  return function(constructor: Function) {
    console.log(`${prefix}: ${constructor.name}`);
  };
}

@Logger('DEBUG')
class User {
  constructor(public name: string) {}
}

// Виведе: "DEBUG: User"
```

## Порядок виконання

Декоратори виконуються знизу вгору:

```typescript
function First() {
  console.log('First factory');
  return function(target: Function) {
    console.log('First decorator');
  };
}

function Second() {
  console.log('Second factory');
  return function(target: Function) {
    console.log('Second decorator');
  };
}

@First()
@Second()
class Example {}

// Виведе:
// First factory
// Second factory
// Second decorator
// First decorator
```

## Коли використовувати декоратори

**Підходять для:**
- Логування
- Валідації
- Авторизації
- Кешування
- Dependency Injection
- ORM (TypeORM, Prisma)
- API фреймворків (NestJS)

**Приклад реального використання:**

```typescript
// NestJS контролер
@Controller('users')
class UsersController {
  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

// TypeORM сутність
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

## Декоратори vs Функції вищого порядку

```typescript
// Функція вищого порядку
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return function(...args: Parameters<T>): ReturnType<T> {
    console.log('Calling function');
    return fn(...args);
  } as T;
}

// Декоратор (більш декларативний)
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log('Calling method');
    return original.apply(this, args);
  };
}
```

## Висновок

Декоратори — потужний інструмент для:
- Декларативного програмування
- Separation of concerns
- Метапрограмування

У наступних уроках розглянемо кожен тип декораторів детальніше.
