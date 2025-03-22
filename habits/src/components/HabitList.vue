<script setup>
import { computed, onMounted } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue'

const props = defineProps({
  selectedDate: String, // Accept selectedDate from parent (App.vue)
})

const store = useHabitStore()

// Get habits based on the selected date using the store method
const habits = computed(() => {
  return store.getHabitsForDate(props.selectedDate).filter(habit => {
    return habit.active && (!habit.stoppedDate || new Date(props.selectedDate) <= new Date(habit.stoppedDate));
  })
})

// Load habits from the store (e.g., from localStorage) on mount
onMounted(() => {
  store.loadHabits() // Load habits when the component is mounted
})
</script>

<template>
  <div>
    <h2>Your habits:</h2>

    <!-- Habit List with Transition -->
    <transition-group name="fade-list" tag="div">
      <HabitItem
        v-for="habit in habits"
        :key="habit.id"
        :habit="habit"
        :selectedDate="selectedDate"
      />
    </transition-group>

    <!-- No habits message -->
    <p v-if="habits.length === 0">No habits for this date.</p>
  </div>
</template>
