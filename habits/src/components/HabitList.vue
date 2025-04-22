<script setup lang="ts">
import { computed } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue'
import { Habit } from '../types'

const props = defineProps<{
  selectedDate: string
}>()

const store = useHabitStore()

const habits = computed<Habit[]>(() => store.habits)
</script>

<template>
  <div class="habits-list">
    <div v-if="habits.length === 0" class="no-habits">No habits created yet.</div>
    <HabitItem
      v-for="habit in habits"
      :key="habit.id"
      :habit="habit"
      :selectedDate="props.selectedDate"
    />
  </div>
</template>
