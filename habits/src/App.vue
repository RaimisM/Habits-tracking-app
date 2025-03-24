<template>
  <div id="app">
    <header>
      <h1>Habit Tracker</h1>
    </header>

    <main>
      <DayNavigator :selectedDate="selectedDate" @dateChanged="updateSelectedDate" />

      <button @click="toggleHabitForm" class="add-habit-button">+ Add Habit</button>

      <div v-if="isOpen" class="add-habit-form">
        <input v-model="newHabit" placeholder="Enter habit name" class="input-field" />
        <button @click="addHabit" class="add-button">Add Habit</button>
        <button @click="toggleHabitForm" class="cancel-button">Cancel</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <HabitList :selectedDate="selectedDate" />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useHabitStore } from './store/habits'
import HabitList from './components/HabitList.vue'
import DayNavigator from './components/DayNavigator.vue'

const store = useHabitStore()
const isOpen = ref(false)
const newHabit = ref('')
const errorMessage = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
store.loadStoppedHabitState();

onMounted(() => {
  console.log("App mounted - Loading habits");
  store.loadHabits()
  store.loadStoppedHabitState();
})

const toggleHabitForm = () => {
  console.log("Toggling add habit form");
  isOpen.value = !isOpen.value;
}

const addHabit = () => {
  if (newHabit.value.trim() === '') {
    errorMessage.value = 'Habit name cannot be empty!';
    console.log("Error: Habit name cannot be empty");
    return;
  }

  console.log(`Adding new habit: ${newHabit.value}`);
  store.addHabit(newHabit.value);
  newHabit.value = '';
  isOpen.value = false;
  errorMessage.value = '';
}

const updateSelectedDate = (newDate) => {
  console.log(`Selected date changed: ${newDate}`);
  selectedDate.value = newDate;
}

// Log when selectedDate changes
watchEffect(() => {
  console.log(`Selected date: ${selectedDate.value}`);
})
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
