<!-- HabitTracker.vue -->
<script setup>
import { computed } from 'vue'
import { useHabitStore } from '../store/habits'

const props = defineProps({
  habit: Object,
  selectedDate: String, // Accept selectedDate from parent (App.vue)
})

const store = useHabitStore()

// Computed property to determine if habit is completed for the selected date
const isCompletedForSelectedDate = computed(() => {
  return props.habit.completedDates && 
         props.habit.completedDates.includes(store.selectedDate);
})

// Computed property to determine the current streak and message
const streakMessage = computed(() => {
  if (!isCompletedForSelectedDate.value) {
    return '';  // Don't show streak message if habit is not completed today
  }

  // Get the last completed dates
  const completedDates = props.habit.completedDates.sort((a, b) => new Date(b) - new Date(a));
  
  // Check for streak
  let streak = 1;  // Current streak starts at 1 because we know the habit is completed today
  for (let i = 1; i < completedDates.length; i++) {
    const diff = (new Date(completedDates[i - 1]) - new Date(completedDates[i])) / (1000 * 3600 * 24); // Difference in days
    if (diff === 1) {
      streak++;
    } else {
      break; // If the difference is not 1, the streak is broken
    }
  }
  
  // Only show message if streak is 3 or more days
  if (streak >= 3) {
    return `Congrats! You've completed your habit for ${streak} consecutive days!`;
  }
  return '';  // Return empty if streak is less than 3 days
})
</script>

<template>
  <!-- Display streak message only if streak is 3 or more days -->
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
