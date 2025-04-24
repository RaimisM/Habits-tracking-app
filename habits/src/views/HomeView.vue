<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useHabitStore } from '../store/habits'
import DayNavigator from '../components/DayNavigator.vue'
import HabitList from '../components/HabitList.vue'

const route = useRoute()
const router = useRouter()
const store = useHabitStore()
const today: string = dayjs().format('YYYY-MM-DD')

const isValidDate = (dateString: string): boolean => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(dateString)) return false

  const date = dayjs(dateString)
  return date.isValid() && date.format('YYYY-MM-DD') === dateString
}

onMounted(() => {
  if (route.params.date) {
    const dateParam = route.params.date as string
    if (isValidDate(dateParam)) {
      store.selectedDate = dateParam
    } else {
      alert("Invalid date detected in URL. Redirecting to today's date.")
      store.selectedDate = today
      router.push(`/day/${today}`)
    }
  }
})

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate) {
      const dateParam = newDate as string
      if (isValidDate(dateParam)) {
        store.selectedDate = dateParam
      } else {
        alert("Invalid date detected. Redirecting to today's date.")
        store.selectedDate = today
        router.push(`/day/${today}`)
      }
    }
  },
)
</script>

<template>
  <div>
    <DayNavigator />
    <HabitList :selectedDate="store.selectedDate" />
  </div>
</template>