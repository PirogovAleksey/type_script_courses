# Масиви та кортежі

## Масиви (Arrays)

### Синтаксис оголошення

Два способи оголосити масив:

```typescript
// Спосіб 1: тип[]
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ['Anna', 'John', 'Mike'];

// Спосіб 2: Array<тип>
let scores: Array<number> = [100, 95, 88];
let cities: Array<string> = ['Kyiv', 'Lviv', 'Odesa'];
```

Обидва способи еквівалентні, але `тип[]` використовується частіше.

### Типізація елементів

```typescript
let numbers: number[] = [1, 2, 3];
numbers.push(4);      // ✅ OK
numbers.push('five'); // ❌ Помилка: string не можна додати до number[]
```

### Масиви різних типів

```typescript
// Union type в масиві
let mixed: (string | number)[] = [1, 'two', 3, 'four'];

// Масив об'єктів
let users: { name: string; age: number }[] = [
  { name: 'Anna', age: 25 },
  { name: 'John', age: 30 }
];
```

### Порожній масив

```typescript
// Потрібно вказати тип для порожнього масиву
let items: string[] = [];
items.push('item1'); // ✅ OK

// Без типу буде never[]
let unknown = [];    // never[] — нічого не можна додати!
```

### Методи масивів

TypeScript знає типи для всіх методів:

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];

// map повертає number[]
let doubled = numbers.map(n => n * 2);

// filter повертає number[]
let evenNumbers = numbers.filter(n => n % 2 === 0);

// find повертає number | undefined
let found = numbers.find(n => n > 3);

// reduce — тип залежить від початкового значення
let sum = numbers.reduce((acc, n) => acc + n, 0);
```

## Кортежі (Tuples)

Кортеж — це масив фіксованої довжини з визначеними типами для кожної позиції.

### Базовий синтаксис

```typescript
// Кортеж: [string, number]
let person: [string, number] = ['Anna', 25];

// Доступ до елементів
let name = person[0];  // string
let age = person[1];   // number
```

### Навіщо кортежі?

```typescript
// Функція повертає кілька значень
function getUser(): [string, number, boolean] {
  return ['John', 30, true];
}

const [name, age, isActive] = getUser();
// name: string, age: number, isActive: boolean
```

### Кортежі з мітками (Labeled Tuples)

```typescript
type UserTuple = [name: string, age: number, isAdmin: boolean];

const user: UserTuple = ['Anna', 25, false];
```

Мітки не впливають на типи, але покращують читабельність.

### Опціональні елементи

```typescript
type Point = [number, number, number?];

const point2D: Point = [10, 20];
const point3D: Point = [10, 20, 30];
```

### Rest елементи в кортежах

```typescript
type StringNumberBooleans = [string, number, ...boolean[]];

const t1: StringNumberBooleans = ['hello', 42, true, false, true];
const t2: StringNumberBooleans = ['hello', 42];
```

### Readonly кортежі

```typescript
const point: readonly [number, number] = [10, 20];
point[0] = 5; // ❌ Помилка: не можна змінювати
```

## Порівняння масивів та кортежів

| Характеристика | Масив | Кортеж |
|----------------|-------|--------|
| Довжина | Змінна | Фіксована |
| Типи елементів | Однаковий для всіх | Різний для кожної позиції |
| Використання | Колекції однотипних даних | Структуровані набори даних |

## Практичні приклади

### Координати

```typescript
type Coordinates = [latitude: number, longitude: number];

const kyiv: Coordinates = [50.4501, 30.5234];
const lviv: Coordinates = [49.8397, 24.0297];
```

### HTTP відповідь

```typescript
type HttpResponse = [status: number, data: string, ok: boolean];

function fetchData(): HttpResponse {
  return [200, '{"name": "John"}', true];
}

const [status, data, ok] = fetchData();
```

### React useState (аналог)

```typescript
type State<T> = [value: T, setValue: (newValue: T) => void];

function useState<T>(initial: T): State<T> {
  let value = initial;
  const setValue = (newValue: T) => { value = newValue; };
  return [value, setValue];
}

const [count, setCount] = useState(0);
```

## Практичне завдання

```typescript
// 1. Створи масив улюблених фільмів
let movies: string[] = [];

// 2. Створи кортеж для RGB кольору
type RGB = [red: number, green: number, blue: number];
let red: RGB = [255, 0, 0];

// 3. Створи кортеж для результату API запиту
type ApiResult = [success: boolean, data: string | null, error: string | null];
```

## Висновок

Масиви підходять для колекцій однотипних даних, кортежі — для структурованих наборів з різними типами. У наступному уроці розглянемо Enum, Any та Unknown.
