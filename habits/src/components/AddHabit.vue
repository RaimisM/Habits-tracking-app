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
    <button @click="isOpen = true" >+ Add Habit</button>

    <div v-if="isOpen" >
      <div>
        <h2>New Habit</h2>
        <input
          v-model="newHabit"
          placeholder="Enter habit name"
        />
        <div>
          <button @click="isOpen = false">Cancel</button>
          <button @click="addHabit">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>
