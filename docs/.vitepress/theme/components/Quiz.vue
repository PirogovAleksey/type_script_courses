<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Question {
  question: string
  code?: string
  options: string[]
  correct: number
  explanation: string
}

const props = defineProps<{
  questions: Question[]
  count?: number
}>()

const count = props.count || 15
const shuffledQuestions = ref<Question[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showExplanation = ref(false)
const score = ref(0)
const answered = ref<boolean[]>([])
const finished = ref(false)

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function initQuiz() {
  const shuffled = shuffleArray(props.questions)
  shuffledQuestions.value = shuffled.slice(0, Math.min(count, shuffled.length))
  currentIndex.value = 0
  selectedAnswer.value = null
  showExplanation.value = false
  score.value = 0
  answered.value = new Array(shuffledQuestions.value.length).fill(false)
  finished.value = false
}

onMounted(() => {
  initQuiz()
})

const currentQuestion = computed(() => shuffledQuestions.value[currentIndex.value])
const progress = computed(() => `${currentIndex.value + 1} / ${shuffledQuestions.value.length}`)
const percentage = computed(() => Math.round((score.value / shuffledQuestions.value.length) * 100))

function selectAnswer(index: number) {
  if (answered.value[currentIndex.value]) return

  selectedAnswer.value = index
  showExplanation.value = true
  answered.value[currentIndex.value] = true

  if (index === currentQuestion.value.correct) {
    score.value++
  }
}

function nextQuestion() {
  if (currentIndex.value < shuffledQuestions.value.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    showExplanation.value = false
  } else {
    finished.value = true
  }
}

function restart() {
  initQuiz()
}

function getOptionClass(index: number) {
  if (!showExplanation.value) {
    return selectedAnswer.value === index ? 'selected' : ''
  }
  if (index === currentQuestion.value.correct) {
    return 'correct'
  }
  if (selectedAnswer.value === index) {
    return 'incorrect'
  }
  return ''
}
</script>

<template>
  <div class="quiz-container">
    <div v-if="!finished && currentQuestion" class="quiz-content">
      <div class="quiz-header">
        <span class="progress">{{ progress }}</span>
        <span class="score">Бали: {{ score }}</span>
      </div>

      <div class="question">
        <h3>{{ currentQuestion.question }}</h3>
        <pre v-if="currentQuestion.code" class="code-block"><code>{{ currentQuestion.code }}</code></pre>
      </div>

      <div class="options">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="['option', getOptionClass(index)]"
          @click="selectAnswer(index)"
          :disabled="answered[currentIndex]"
        >
          <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
          <span class="option-text">{{ option }}</span>
        </button>
      </div>

      <div v-if="showExplanation" class="explanation">
        <p><strong>Пояснення:</strong> {{ currentQuestion.explanation }}</p>
        <button class="next-btn" @click="nextQuestion">
          {{ currentIndex < shuffledQuestions.length - 1 ? 'Наступне питання' : 'Завершити' }}
        </button>
      </div>
    </div>

    <div v-else-if="finished" class="quiz-results">
      <h2>Результати</h2>
      <div class="score-display">
        <div class="score-circle" :class="{ good: percentage >= 70, bad: percentage < 50 }">
          {{ percentage }}%
        </div>
        <p>{{ score }} з {{ shuffledQuestions.length }} правильних відповідей</p>
      </div>

      <div class="result-message">
        <p v-if="percentage >= 90">Відмінно! Ти майстер TypeScript!</p>
        <p v-else-if="percentage >= 70">Добре! Ти добре розумієш матеріал.</p>
        <p v-else-if="percentage >= 50">Непогано, але варто повторити деякі теми.</p>
        <p v-else>Рекомендую перечитати цей розділ ще раз.</p>
      </div>

      <button class="restart-btn" @click="restart">Пройти ще раз</button>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.progress, .score {
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.question h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.code-block {
  background: var(--vp-c-bg-alt);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.option:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.option:disabled {
  cursor: not-allowed;
}

.option.selected {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.option.correct {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.option.incorrect {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--vp-c-bg-alt);
  font-weight: 600;
  font-size: 0.85rem;
}

.option-text {
  flex: 1;
}

.explanation {
  margin-top: 1.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-brand);
}

.next-btn, .restart-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.next-btn:hover, .restart-btn:hover {
  opacity: 0.9;
}

.quiz-results {
  text-align: center;
}

.quiz-results h2 {
  margin-bottom: 1.5rem;
}

.score-display {
  margin: 2rem 0;
}

.score-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--vp-c-bg-alt);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  border: 4px solid var(--vp-c-divider);
}

.score-circle.good {
  border-color: #10b981;
  color: #10b981;
}

.score-circle.bad {
  border-color: #ef4444;
  color: #ef4444;
}

.result-message {
  margin: 1.5rem 0;
  font-size: 1.1rem;
}
</style>
