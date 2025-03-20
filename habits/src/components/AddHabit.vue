<script setup>
import { ref } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const newHabit = ref('')
const isOpen = ref(false)
const errorMessage = ref('')

const addHabit = () => {
  if (newHabit.value.trim() === '') {
    errorMessage.value = 'Habit name cannot be empty!'
    return
  }

  store.addHabit(newHabit.value)
  newHabit.value = ''
  isOpen.value = false
  errorMessage.value = '' // Clear error message
}
</script>

<template>
  <div>
    <button @click="isOpen = true" class="btn btn-primary">+ Add Habit</button>

    <div v-if="isOpen" class="modal-bg">
      <div class="modal-content">
        <h2 class="text-lg font-semibold">New Habit</h2>
        <input
          v-model="newHabit"
          class="border p-2 w-full rounded mt-2"
          placeholder="Enter habit name"
        />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="isOpen = false" class="btn btn-danger">Cancel</button>
          <button @click="addHabit" class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
