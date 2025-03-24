<script setup>
import { computed } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue'

const props = defineProps({
  selectedDate: String,
})

const store = useHabitStore()

// Load all habits
const habits = computed(() => {
  return store.habits
})
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
