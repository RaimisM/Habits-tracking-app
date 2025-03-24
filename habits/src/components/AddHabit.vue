<script setup>
import { ref } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const newHabit = ref('')
const isOpen = ref(false)
const errorMessage = ref('')

const addHabit = () => {
  console.log('addHabit triggered')
  if (newHabit.value.trim() === '') {
    errorMessage.value = 'Habit name cannot be empty!'
    return
  }

  store.addHabit(newHabit.value)
  console.log('Habits after adding:', store.habits)
  newHabit.value = ''
  isOpen.value = false
  errorMessage.value = ''
}
</script>

<template>
  <div>
    <button @click="isOpen = true">+ Add Habit</button>

    <div v-if="isOpen" class="modal">
      <div class="modal-content">
        <h2>New Habit</h2>
        <input v-model="newHabit" placeholder="Enter habit name" />
        <div>
          <button @click="isOpen = false">Cancel</button>
          <button @click="addHabit">Add</button>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}

button {
  padding: 8px 12px;
  margin: 5px;
}

.error {
  color: red;
  font-size: 14px;
}
</style>
