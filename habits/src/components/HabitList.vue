<script setup>
import { computed } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue'

defineProps({
  selectedDate: String, // Keeping this since it's used in HabitItem
})

const store = useHabitStore()

// Load all habits
const habits = computed(() => store.habits)
</script>

<template>
  <div class="habits-list">
    <div v-if="habits.length === 0" class="no-habits">No habits created yet.</div>
    <HabitItem
      v-for="habit in habits"
      :key="habit.id"
      :habit="habit"
      :selectedDate="selectedDate"
    />
  </div>
</template>
