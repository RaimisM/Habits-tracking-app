<script setup>
import { ref, computed } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue' // ✅ Import the HabitItem component

const store = useHabitStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])

// Use the getter to retrieve habits for the selected date
const habits = computed(() => store.getHabitsForDate(selectedDate.value))
</script>

<template>
  <div class="mt-4">
    <h2 class="text-xl font-bold mb-2">Habits for {{ selectedDate }}</h2>

    <!-- Loading spinner -->
    <div v-if="habits.length === 0" class="flex justify-center items-center h-48">
      <div
        class="spinner-border animate-spin border-4 rounded-full border-t-blue-500 border-gray-200 w-16 h-16"
      ></div>
    </div>

    <!-- Habit list -->
    <transition-group name="fade">
      <HabitItem v-for="habit in habits" :key="habit.id" :habit="habit" />
    </transition-group>

    <!-- No habits message -->
    <p v-if="habits.length === 0" class="text-gray-500">No habits added yet.</p>
  </div>
  <div class="flex justify-center items-center h-48">
    <div class="spinner"></div>
  </div>
</template>
