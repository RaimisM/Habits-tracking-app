<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()
const today = dayjs().format('YYYY-MM-DD')
const selectedDate = ref(today)

const changeDay = (days) => {
  const newDate = dayjs(selectedDate.value).add(days, 'day').format('YYYY-MM-DD')
  if (dayjs(newDate).isAfter(today)) return // Prevent future dates
  selectedDate.value = newDate
  router.push(`/day/${newDate}`)
}
</script>

<template>
  <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
    <transition name="slide">
      <button @click="changeDay(-1)" class="px-3 py-2 bg-blue-500 text-white rounded md:text-lg">
        ← Previous
      </button>
    </transition>
    <span class="font-semibold text-lg md:text-xl">{{ selectedDate }}</span>
    <transition name="slide">
      <button
        @click="changeDay(1)"
        :disabled="selectedDate === today"
        class="px-3 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 md:text-lg"
      >
        Next →
      </button>
    </transition>
  </div>
</template>

<style scoped>
/* Adjust for mobile responsiveness */
@media (max-width: 640px) {
  .day-nav-btn {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>
