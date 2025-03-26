<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'
import { useHabitStore } from '../store/habits'

const props = defineProps({
  habit: {
    type: Object,
    required: true,
  },
})

const store = useHabitStore()

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

const streakMessage = computed(() => {
  if (!props.habit.completedDates || props.habit.completedDates.length === 0) {
    return ''
  }

  if (!props.habit.completedDates.includes(store.selectedDate)) {
    return ''
  }

  const completedDates = [...props.habit.completedDates].sort((a, b) => new Date(b) - new Date(a))
  const selectedDateIndex = completedDates.findIndex((date) =>
    isSameDay(new Date(date), new Date(store.selectedDate)),
  )

  if (selectedDateIndex === -1) {
    return ''
  }

  let streak = 1
  for (let i = selectedDateIndex + 1; i < completedDates.length; i++) {
    const diff =
      (new Date(completedDates[i - 1]) - new Date(completedDates[i])) / (1000 * 3600 * 24)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak >= 3 ? `You've completed your habit for ${streak} consecutive days!` : ''
})
</script>

<template>
  <div v-if="streakMessage" class="streak-message">
    <span>{{ streakMessage }}</span>
  </div>
</template>

<style scoped>
.streak-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}
</style>
