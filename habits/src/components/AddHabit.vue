<script setup lang="ts">
import { ref } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const newHabit = ref<string>('')
const isOpen = ref<boolean>(false)
const errorMessage = ref<string>('')

const addHabit = (): void => {
  if (newHabit.value.trim() === '') {
    errorMessage.value = 'Habit name cannot be empty!'
    return
  }

  store.addHabit(newHabit.value)
  newHabit.value = ''
  isOpen.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div class="add-habit-container">
    <button @click="isOpen = true" class="add-habit-button">+ Add Habit</button>

    <div v-if="isOpen" class="habit-modal-overlay">
      <div class="habit-modal">
        <h2 class="modal-title">Create New Habit</h2>

        <input
          v-model="newHabit"
          placeholder="Enter habit name"
          class="habit-input"
          @keyup.enter="addHabit"
        />

        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>

        <div class="modal-actions">
          <button @click="isOpen = false" class="btn btn-cancel">Cancel</button>
          <button @click="addHabit" class="btn btn-add">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-habit-container {
  position: relative;
  margin: 1rem 0;
}

.add-habit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.add-habit-button:hover {
  background-color: #45a049;
}

.habit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.habit-modal {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-title {
  margin-bottom: 1.5rem;
  color: #333;
}

.habit-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.error-message {
  color: #d9534f;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: bold;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-cancel {
  background-color: #f0f0f0;
  color: #333;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-add {
  background-color: #4caf50;
  color: white;
}

.btn-add:hover {
  background-color: #45a049;
}
</style>
