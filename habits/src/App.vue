<template>
  <div id="app">
    <!-- App Header -->
    <header>
      <h1>Habit Tracker</h1>
    </header>

    <!-- Main Section -->
    <main>
      <!-- Date Navigator (DayNavigator.vue) -->
      <DayNavigator :selectedDate="selectedDate" @dateChanged="updateSelectedDate" />

      <!-- Button to toggle Add Habit Form -->
      <button @click="isOpen = !isOpen" class="add-habit-button">+ Add Habit</button>

      <!-- Add Habit Form -->
      <div v-if="isOpen" class="add-habit-form">
        <input
          v-model="newHabit"
          placeholder="Enter habit name"
          class="input-field"
        />
        <button @click="addHabit" class="add-button">Add Habit</button>
        <button @click="isOpen = false" class="cancel-button">Cancel</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <!-- Habit List Component -->
      <HabitList :selectedDate="selectedDate" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHabitStore } from './store/habits'
import HabitList from './components/HabitList.vue'
import DayNavigator from './components/DayNavigator.vue'

const store = useHabitStore()
const isOpen = ref(false)
const newHabit = ref('')
const errorMessage = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0]) // Default to today's date

// Load habits when component mounts
onMounted(() => {
  store.loadHabits()
})

// Function to add a new habit
const addHabit = () => {
  if (newHabit.value.trim() === '') {
    errorMessage.value = 'Habit name cannot be empty!'
    return
  }

  store.addHabit(newHabit.value)
  newHabit.value = ''
  isOpen.value = false
  errorMessage.value = ''  // Clear error message after adding the habit
}

// Update the selected date when received from DayNavigator
const updateSelectedDate = (newDate) => {
  selectedDate.value = newDate
}
</script>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

.add-habit-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.add-habit-button:hover {
  background-color: #45a049;
}

.add-habit-form {
  margin-top: 20px;
}

.input-field {
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button, .cancel-button {
  padding: 8px 16px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.add-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.add-button:hover {
  background-color: #45a049;
}

.cancel-button {
  background-color: #f44336;
  color: white;
  border: none;
}

.cancel-button:hover {
  background-color: #e53935;
}

.error-message {
  color: #f44336;
  margin-top: 10px;
}

main {
  margin-top: 20px;
}
</style>
