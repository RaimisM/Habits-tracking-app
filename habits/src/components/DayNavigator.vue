<script lang="ts" setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const router = useRouter()
const route = useRoute()
const showDatePicker = ref(false)

const today: string = dayjs().format('YYYY-MM-DD')

const isValidDate = (dateString: string): boolean => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/
  if (!datePattern.test(dateString)) return false

  const date = dayjs(dateString)
  return date.isValid() && date.format('YYYY-MM-DD') === dateString
}

const isFutureDate = (dateString: string): boolean => {
  return dayjs(dateString).isAfter(today, 'day')
}

const validateAndProcessDate = (dateString: string): string => {
  if (!isValidDate(dateString)) {
    alert('Invalid date format. Please use YYYY-MM-DD format with valid date values.')
    return today
  }

  if (isFutureDate(dateString)) {
    alert('Cannot navigate to future dates. Redirecting to today.')
    return today
  }

  return dateString
}

const selectedDate = computed<string>({
  get: () => store.selectedDate,
  set: (newDate: string) => {
    const validatedDate = validateAndProcessDate(newDate)
    store.selectedDate = validatedDate
    router.push(`/day/${validatedDate}`)
  },
})

const changeDay = (days: number): void => {
  const newDate = dayjs(selectedDate.value).add(days, 'day').format('YYYY-MM-DD')
  if (dayjs(newDate).isAfter(today)) return
  selectedDate.value = newDate
}

const toggleDatePicker = (): void => {
  showDatePicker.value = !showDatePicker.value
}

const handleDateSelect = (event: Event): void => {
  const input = event.target as HTMLInputElement
  const newDate = input.value
  selectedDate.value = newDate
  showDatePicker.value = false
}

const maxDate = computed(() => today)

onMounted(() => {
  const routeDate = route.params.date as string | undefined
  if (routeDate) {
    const validatedDate = validateAndProcessDate(routeDate)
    store.selectedDate = validatedDate

    if (validatedDate !== routeDate) {
      router.push(`/day/${validatedDate}`)
    }
  } else {
    store.selectedDate = today
  }
})

watch(
  () => route.params.date,
  (newDate) => {
    if (typeof newDate === 'string') {
      const validatedDate = validateAndProcessDate(newDate)
      store.selectedDate = validatedDate

      if (validatedDate !== newDate) {
        router.push(`/day/${validatedDate}`)
      }
    } else {
      store.selectedDate = today
      router.push(`/day/${today}`)
    }
  },
)
</script>

<template>
  <div class="day-navigator">
    <button @click="changeDay(-1)" class="nav-btn">← Previous</button>

    <div class="date-selector">
      <span @click="toggleDatePicker" class="selected-date">{{ selectedDate }}</span>

      <div v-if="showDatePicker" class="date-picker-container">
        <input
          type="date"
          :value="selectedDate"
          :max="maxDate"
          @change="handleDateSelect"
          class="date-picker"
          ref="datePicker"
        />
      </div>
    </div>

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

.date-selector {
  position: relative;
}

.selected-date {
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.selected-date:hover {
  background-color: #e5e7eb;
}

.date-picker-container {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 5px;
  z-index: 10;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
}

.date-picker {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 6px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .nav-btn {
    padding: 6px 10px;
    font-size: 14px;
  }
}
</style>
