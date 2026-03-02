import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Курс TypeScript',
  description: 'Вивчай TypeScript з нуля до професіонала',
  lang: 'uk-UA',
  base: '/type_script_courses/',

  head: [
    ['link', { rel: 'icon', href: '/type_script_courses/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Головна', link: '/' },
      { text: 'Курс', link: '/01-intro/what-is-typescript' },
    ],

    sidebar: [
      {
        text: '1. Вступ',
        collapsed: false,
        items: [
          { text: 'Що таке TypeScript', link: '/01-intro/what-is-typescript' },
          { text: 'Налаштування середовища', link: '/01-intro/setup' },
        ]
      },
      {
        text: '2. Базові типи',
        collapsed: false,
        items: [
          { text: 'Примітивні типи', link: '/02-basic-types/primitives' },
          { text: 'Масиви та кортежі', link: '/02-basic-types/arrays-tuples' },
          { text: 'Enum, Any, Unknown', link: '/02-basic-types/enum-any-unknown' },
        ]
      },
      {
        text: '3. Функції',
        collapsed: false,
        items: [
          { text: 'Типізація параметрів', link: '/03-functions/parameters' },
          { text: 'Типи повернення', link: '/03-functions/return-types' },
          { text: 'Перевантаження функцій', link: '/03-functions/overloading' },
        ]
      },
      {
        text: '4. Інтерфейси та типи',
        collapsed: false,
        items: [
          { text: 'Interfaces', link: '/04-interfaces/interfaces' },
          { text: 'Type Aliases', link: '/04-interfaces/type-aliases' },
          { text: 'Interface vs Type', link: '/04-interfaces/interface-vs-type' },
        ]
      },
      {
        text: '5. Класи',
        collapsed: false,
        items: [
          { text: 'Основи класів', link: '/05-classes/basics' },
          { text: 'Модифікатори доступу', link: '/05-classes/access-modifiers' },
          { text: 'Абстрактні класи', link: '/05-classes/abstract' },
        ]
      },
      {
        text: '6. Generics',
        collapsed: false,
        items: [
          { text: 'Вступ до Generics', link: '/06-generics/intro' },
          { text: 'Generic функції', link: '/06-generics/functions' },
          { text: 'Generic класи', link: '/06-generics/classes' },
          { text: 'Constraints', link: '/06-generics/constraints' },
        ]
      },
      {
        text: '7. Модулі',
        collapsed: false,
        items: [
          { text: 'Import та Export', link: '/07-modules/import-export' },
          { text: 'Налаштування tsconfig', link: '/07-modules/tsconfig' },
        ]
      },
      {
        text: '8. Практика',
        collapsed: false,
        items: [
          { text: 'Проєкт: Todo App', link: '/08-practice/todo-app' },
          { text: 'Проєкт: API Client', link: '/08-practice/api-client' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: 'Курс TypeScript',
      copyright: 'Copyright © 2024'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: 'На цій сторінці'
    },

    docFooter: {
      prev: 'Попередня',
      next: 'Наступна'
    }
  }
})
