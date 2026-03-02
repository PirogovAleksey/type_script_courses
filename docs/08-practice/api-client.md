# Проєкт: API Client

Створимо типобезпечний HTTP клієнт.

## Структура

```
api-client/
├── src/
│   ├── types/
│   │   ├── http.ts
│   │   └── api.ts
│   ├── client/
│   │   ├── httpClient.ts
│   │   └── apiClient.ts
│   ├── interceptors/
│   │   └── index.ts
│   └── index.ts
├── package.json
└── tsconfig.json
```

## Крок 1: HTTP Types

```typescript
// src/types/http.ts

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  timeout?: number;
}

export interface Response<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface HttpError {
  message: string;
  status: number;
  statusText: string;
  data?: unknown;
}

export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
export type ResponseInterceptor<T = unknown> = (response: Response<T>) => Response<T> | Promise<Response<T>>;
export type ErrorInterceptor = (error: HttpError) => HttpError | Promise<HttpError>;
```

## Крок 2: API Types

```typescript
// src/types/api.ts

// Типи для конкретного API
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  body: string;
}

// DTOs
export type CreateUserDto = Omit<User, 'id' | 'createdAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export type CreatePostDto = Omit<Post, 'id' | 'createdAt'>;
export type UpdatePostDto = Partial<CreatePostDto>;

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Endpoints Type Map
export interface ApiEndpoints {
  '/users': {
    GET: { response: User[]; params: PaginationParams };
    POST: { response: User; body: CreateUserDto };
  };
  '/users/:id': {
    GET: { response: User };
    PUT: { response: User; body: UpdateUserDto };
    DELETE: { response: void };
  };
  '/posts': {
    GET: { response: Post[]; params: PaginationParams & { userId?: number } };
    POST: { response: Post; body: CreatePostDto };
  };
  '/posts/:id': {
    GET: { response: Post };
    PUT: { response: Post; body: UpdatePostDto };
    DELETE: { response: void };
  };
  '/posts/:id/comments': {
    GET: { response: Comment[] };
  };
}
```

## Крок 3: HTTP Client

```typescript
// src/client/httpClient.ts

import {
  RequestConfig,
  Response,
  HttpError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor
} from '../types/http';

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: {
    baseUrl: string;
    headers?: Record<string, string>;
    timeout?: number;
  }) {
    this.baseUrl = config.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers
    };
    this.defaultTimeout = config.timeout || 10000;
  }

  // Interceptors
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor<T>(interceptor: ResponseInterceptor<T>): void {
    this.responseInterceptors.push(interceptor as ResponseInterceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // Основний метод
  async request<T>(config: RequestConfig): Promise<Response<T>> {
    // Застосовуємо request interceptors
    let processedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }

    // Будуємо URL
    let url = `${this.baseUrl}${processedConfig.url}`;
    if (processedConfig.params) {
      const searchParams = new URLSearchParams();
      Object.entries(processedConfig.params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Створюємо AbortController для timeout
    const controller = new AbortController();
    const timeout = processedConfig.timeout || this.defaultTimeout;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchResponse = await fetch(url, {
        method: processedConfig.method,
        headers: {
          ...this.defaultHeaders,
          ...processedConfig.headers
        },
        body: processedConfig.body ? JSON.stringify(processedConfig.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!fetchResponse.ok) {
        const error: HttpError = {
          message: `HTTP Error: ${fetchResponse.status}`,
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          data: await fetchResponse.json().catch(() => null)
        };

        // Застосовуємо error interceptors
        let processedError = error;
        for (const interceptor of this.errorInterceptors) {
          processedError = await interceptor(processedError);
        }

        throw processedError;
      }

      let response: Response<T> = {
        data: await fetchResponse.json(),
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers
      };

      // Застосовуємо response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response) as Response<T>;
      }

      return response;

    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          message: 'Request timeout',
          status: 408,
          statusText: 'Request Timeout'
        } as HttpError;
      }

      throw error;
    }
  }

  // Shorthand методи
  async get<T>(url: string, params?: Record<string, string | number | boolean>): Promise<Response<T>> {
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T>(url: string, body?: unknown): Promise<Response<T>> {
    return this.request<T>({ method: 'POST', url, body });
  }

  async put<T>(url: string, body?: unknown): Promise<Response<T>> {
    return this.request<T>({ method: 'PUT', url, body });
  }

  async patch<T>(url: string, body?: unknown): Promise<Response<T>> {
    return this.request<T>({ method: 'PATCH', url, body });
  }

  async delete<T>(url: string): Promise<Response<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }
}
```

## Крок 4: Типобезпечний API Client

```typescript
// src/client/apiClient.ts

import { HttpClient } from './httpClient';
import type {
  User, Post, Comment,
  CreateUserDto, UpdateUserDto,
  CreatePostDto, UpdatePostDto,
  PaginationParams, PaginatedResponse
} from '../types/api';

export class ApiClient {
  private http: HttpClient;

  constructor(baseUrl: string, token?: string) {
    this.http = new HttpClient({
      baseUrl,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  // Users
  users = {
    getAll: async (params?: PaginationParams): Promise<User[]> => {
      const response = await this.http.get<User[]>('/users', params);
      return response.data;
    },

    getById: async (id: number): Promise<User> => {
      const response = await this.http.get<User>(`/users/${id}`);
      return response.data;
    },

    create: async (data: CreateUserDto): Promise<User> => {
      const response = await this.http.post<User>('/users', data);
      return response.data;
    },

    update: async (id: number, data: UpdateUserDto): Promise<User> => {
      const response = await this.http.put<User>(`/users/${id}`, data);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await this.http.delete(`/users/${id}`);
    }
  };

  // Posts
  posts = {
    getAll: async (params?: PaginationParams & { userId?: number }): Promise<Post[]> => {
      const response = await this.http.get<Post[]>('/posts', params);
      return response.data;
    },

    getById: async (id: number): Promise<Post> => {
      const response = await this.http.get<Post>(`/posts/${id}`);
      return response.data;
    },

    create: async (data: CreatePostDto): Promise<Post> => {
      const response = await this.http.post<Post>('/posts', data);
      return response.data;
    },

    update: async (id: number, data: UpdatePostDto): Promise<Post> => {
      const response = await this.http.put<Post>(`/posts/${id}`, data);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await this.http.delete(`/posts/${id}`);
    },

    getComments: async (postId: number): Promise<Comment[]> => {
      const response = await this.http.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    }
  };

  // Auth методи
  setToken(token: string): void {
    this.http.addRequestInterceptor(config => ({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }));
  }
}
```

## Крок 5: Interceptors

```typescript
// src/interceptors/index.ts

import type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from '../types/http';

// Логування запитів
export const loggerInterceptor: RequestInterceptor = (config) => {
  console.log(`[${new Date().toISOString()}] ${config.method} ${config.url}`);
  return config;
};

// Retry interceptor
export const createRetryInterceptor = (maxRetries: number): ErrorInterceptor => {
  let retryCount = 0;

  return async (error) => {
    if (retryCount < maxRetries && error.status >= 500) {
      retryCount++;
      console.log(`Retrying... Attempt ${retryCount}`);
      // Тут можна додати логіку повторного запиту
    }
    throw error;
  };
};

// Cache interceptor
export const createCacheInterceptor = () => {
  const cache = new Map<string, { data: unknown; timestamp: number }>();
  const TTL = 60000; // 1 хвилина

  const requestInterceptor: RequestInterceptor = (config) => {
    if (config.method === 'GET') {
      const key = `${config.url}?${JSON.stringify(config.params)}`;
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < TTL) {
        // Повертаємо кешовані дані
        (config as any).__cached = cached.data;
      }
    }
    return config;
  };

  const responseInterceptor: ResponseInterceptor = (response) => {
    // Кешуємо GET запити
    const key = response.headers.get('x-request-url') || '';
    cache.set(key, { data: response.data, timestamp: Date.now() });
    return response;
  };

  return { requestInterceptor, responseInterceptor };
};

// Auth token refresh
export const createAuthInterceptor = (
  refreshToken: () => Promise<string>
): ErrorInterceptor => {
  return async (error) => {
    if (error.status === 401) {
      try {
        const newToken = await refreshToken();
        // Оновлюємо токен і повторюємо запит
        console.log('Token refreshed:', newToken);
      } catch {
        // Redirect to login
        console.log('Token refresh failed, redirecting to login...');
      }
    }
    throw error;
  };
};
```

## Крок 6: Використання

```typescript
// src/index.ts

import { ApiClient } from './client/apiClient';
import { loggerInterceptor } from './interceptors';

async function main() {
  // Створюємо клієнт
  const api = new ApiClient('https://jsonplaceholder.typicode.com');

  try {
    // Отримуємо користувачів
    const users = await api.users.getAll({ limit: 5 });
    console.log('Users:', users);

    // Отримуємо конкретного користувача
    const user = await api.users.getById(1);
    console.log('User:', user);

    // Отримуємо пости користувача
    const posts = await api.posts.getAll({ userId: 1 });
    console.log('Posts:', posts);

    // Отримуємо коментарі до поста
    const comments = await api.posts.getComments(1);
    console.log('Comments:', comments);

    // Створюємо новий пост
    const newPost = await api.posts.create({
      title: 'New Post',
      body: 'Post content',
      userId: 1
    });
    console.log('Created post:', newPost);

  } catch (error) {
    console.error('API Error:', error);
  }
}

main();
```

## Додатково: Generic Resource

```typescript
// src/client/resource.ts

import { HttpClient } from './httpClient';

interface Entity {
  id: number;
}

export class Resource<T extends Entity, CreateDto, UpdateDto> {
  constructor(
    private http: HttpClient,
    private path: string
  ) {}

  async getAll(params?: Record<string, string | number>): Promise<T[]> {
    const response = await this.http.get<T[]>(this.path, params);
    return response.data;
  }

  async getById(id: number): Promise<T> {
    const response = await this.http.get<T>(`${this.path}/${id}`);
    return response.data;
  }

  async create(data: CreateDto): Promise<T> {
    const response = await this.http.post<T>(this.path, data);
    return response.data;
  }

  async update(id: number, data: UpdateDto): Promise<T> {
    const response = await this.http.put<T>(`${this.path}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete(`${this.path}/${id}`);
  }
}

// Використання
const usersResource = new Resource<User, CreateUserDto, UpdateUserDto>(
  httpClient,
  '/users'
);
```

## Що ми використали

- **Generics**: `Response<T>`, `Resource<T, C, U>`
- **Type-safe API**: ApiEndpoints type map
- **Interceptors**: Request/Response/Error handling
- **Utility Types**: `Omit`, `Partial`, `Record`
- **Async/Await**: Promise-based API

## Подальші ідеї

1. Додати кешування
2. Реалізувати retry логіку
3. Додати request cancellation
4. Інтегрувати з React Query / SWR
5. Додати WebSocket підтримку
