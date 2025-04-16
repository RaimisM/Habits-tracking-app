<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useHabitStore } from '../store/habits'

const router = useRouter()
const route = useRoute()
const store = useHabitStore()

const today = dayjs().format('YYYY-MM-DD')

const selectedDate = computed({
  get: () => store.selectedDate,
  set: (newDate) => {
    store.selectedDate = newDate
    router.push(`/day/${newDate}`)
  }
})

const changeDay = (days) => {
  const newDate = dayjs(selectedDate.value).add(days, 'day').format('YYYY-MM-DD')
  if (dayjs(newDate).isAfter(today)) return
  selectedDate.value = newDate
}

onMounted(() => {
  if (route.params.date && route.params.date !== selectedDate.value) {
    store.selectedDate = route.params.date
  }
})

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate && newDate !== store.selectedDate) {
      store.selectedDate = newDate
    }
  }
)
</script>

<template>
  <div class="day-navigator">
    <button @click="changeDay(-1)" class="nav-btn">← Previous</button>
    <span class="selected-date">{{ selectedDate }}</span>
    <button @click="changeDay(1)" :disabled="selectedDate === today" class="nav-btn">Next →</button>
  </div>
</template>

<style scoped>
.day-navigator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.selected-date {
  font-weight: bold;
  font-size: 16px;
}

@media (max-width: 640px) {
  .nav-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>
