<template>
  <div class="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-2">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        v-model="habit.completed"
        @change="handleUpdateHabitStatus"
        class="transition-all duration-300 transform scale-125 checked:bg-blue-500"
      />
      <span :class="{ 'line-through text-gray-400': habit.completed }" class="text-lg">
        {{ habit.name }}
      </span>
    </div>
    <button @click="handleRemoveHabit" class="text-red-500 hover:text-red-700">Delete</button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore() // ✅ Get the store instance

const props = defineProps({
  habit: Object,
})

// ✅ Rename functions to avoid conflict
const handleUpdateHabitStatus = () => {
  store.updateHabitStatus(props.habit.id, props.habit.completed)
}

const handleRemoveHabit = () => {
  store.removeHabit(props.habit.id)
}
</script>

<style scoped>
/* Transition effect for checkbox */
input[type='checkbox'] {
  transition:
    transform 0.3s ease-in-out,
    background-color 0.2s ease-in-out;
}
</style>
