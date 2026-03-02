import DefaultTheme from 'vitepress/theme'
import Quiz from './components/Quiz.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
  }
} satisfies Theme
