# Generic класи

Класи з параметрами типу для гнучких структур даних.

## Базовий синтаксис

```typescript
class Box<T> {
  private content: T;

  constructor(value: T) {
    this.content = value;
  }

  getValue(): T {
    return this.content;
  }

  setValue(value: T): void {
    this.content = value;
  }
}

const stringBox = new Box('hello');
console.log(stringBox.getValue()); // "hello"

const numberBox = new Box(42);
console.log(numberBox.getValue()); // 42
```

## Кілька параметрів типу

```typescript
class Pair<T, U> {
  constructor(
    public first: T,
    public second: U
  ) {}

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  toArray(): [T, U] {
    return [this.first, this.second];
  }
}

const pair = new Pair('hello', 42);
console.log(pair.first);  // "hello"
console.log(pair.second); // 42

const swapped = pair.swap();
console.log(swapped.first);  // 42
console.log(swapped.second); // "hello"
```

## Колекції

### Stack (LIFO)

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop()); // 3
console.log(stack.peek()); // 2
```

### Queue (FIFO)

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const queue = new Queue<string>();
queue.enqueue('first');
queue.enqueue('second');
console.log(queue.dequeue()); // "first"
```

### Linked List

```typescript
class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null
  ) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;

  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  find(predicate: (value: T) => boolean): T | undefined {
    let current = this.head;

    while (current) {
      if (predicate(current.value)) {
        return current.value;
      }
      current = current.next;
    }

    return undefined;
  }
}
```

## Repository Pattern

```typescript
interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private items: Map<number, T> = new Map();

  save(item: T): void {
    this.items.set(item.id, item);
  }

  findById(id: number): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  delete(id: number): boolean {
    return this.items.delete(id);
  }

  update(id: number, updates: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (item) {
      const updated = { ...item, ...updates };
      this.items.set(id, updated);
      return updated;
    }
    return undefined;
  }
}

interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.save({ id: 1, name: 'Anna', email: 'anna@example.com' });
const user = userRepo.findById(1);
```

## State Management

```typescript
class Store<T> {
  private state: T;
  private listeners: Array<(state: T) => void> = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
    this.notify();
  }

  update(updater: (state: T) => T): void {
    this.state = updater(this.state);
    this.notify();
  }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Використання
interface AppState {
  user: { name: string } | null;
  theme: 'light' | 'dark';
}

const store = new Store<AppState>({
  user: null,
  theme: 'light'
});

store.subscribe(state => {
  console.log('State changed:', state);
});

store.update(state => ({
  ...state,
  user: { name: 'Anna' }
}));
```

## Event Emitter

```typescript
class EventEmitter<T extends Record<string, unknown>> {
  private handlers: Map<keyof T, Set<(payload: any) => void>> = new Map();

  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit<K extends keyof T>(event: K, payload: T[K]): void {
    this.handlers.get(event)?.forEach(handler => handler(payload));
  }

  once<K extends keyof T>(event: K, handler: (payload: T[K]) => void): void {
    const onceHandler = (payload: T[K]) => {
      handler(payload);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }
}

// Типізовані події
interface AppEvents {
  userLogin: { userId: number; timestamp: Date };
  userLogout: { userId: number };
  error: { message: string; code: number };
}

const events = new EventEmitter<AppEvents>();

events.on('userLogin', ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

events.emit('userLogin', { userId: 1, timestamp: new Date() });
```

## Наслідування Generic класів

```typescript
class BaseCollection<T> {
  protected items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

class SortedCollection<T> extends BaseCollection<T> {
  constructor(private compareFn: (a: T, b: T) => number) {
    super();
  }

  add(item: T): void {
    super.add(item);
    this.items.sort(this.compareFn);
  }
}

const numbers = new SortedCollection<number>((a, b) => a - b);
numbers.add(3);
numbers.add(1);
numbers.add(2);
console.log(numbers.getAll()); // [1, 2, 3]
```

## Практичне завдання

```typescript
// 1. Створи клас Cache з TTL
class Cache<T> {
  private data = new Map<string, { value: T; expires: number }>();

  constructor(private ttl: number = 60000) {}

  set(key: string, value: T): void {
    this.data.set(key, {
      value,
      expires: Date.now() + this.ttl
    });
  }

  get(key: string): T | undefined {
    const item = this.data.get(key);
    if (!item) return undefined;

    if (Date.now() > item.expires) {
      this.data.delete(key);
      return undefined;
    }

    return item.value;
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
}

// 2. Створи клас Observable
class Observable<T> {
  private value: T;
  private observers: Set<(value: T) => void> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    this.observers.forEach(fn => fn(newValue));
  }

  observe(fn: (value: T) => void): () => void {
    this.observers.add(fn);
    return () => this.observers.delete(fn);
  }
}
```

## Висновок

Generic класи ідеальні для:
- Колекцій та структур даних
- Repository pattern
- State management
- Event systems
- Кешування

Вони забезпечують типобезпеку при збереженні гнучкості.
