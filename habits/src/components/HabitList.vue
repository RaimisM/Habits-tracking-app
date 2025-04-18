<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue'

// Define prop types
interface Props {
  selectedDate: string
}

const props = defineProps<Props>()

const store = useHabitStore()

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