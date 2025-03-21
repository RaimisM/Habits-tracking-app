<script setup>
import { useHabitStore } from '../store/habits'
import { ref } from 'vue'

const store = useHabitStore()
const props = defineProps({
  habit: Object,
})

const isEditing = ref(false)
const newName = ref(props.habit.name)

const updateHabitStatus = () => {
  store.updateHabitStatus(props.habit.id, props.habit.completed)
}

const removeHabit = () => {
  store.removeHabit(props.habit.id)
}

const stopHabit = () => {
  store.stopHabit(props.habit.id)
}

const editHabit = () => {
  if (isEditing.value) {
    if (newName.value.trim() !== '') {
      store.updateHabitName(props.habit.id, newName.value)
    }
  }
  isEditing.value = !isEditing.value
}
</script>

<template>
  <div class="habit-item">
    <!-- Habit name with edit functionality -->
    <div>
      <input
        type="checkbox"
        v-model="habit.completed"
        @change="updateHabitStatus"
        class="habit-checkbox"
      />
      <div>
        <span v-if="!isEditing" :class="{ 'completed': habit.completed }">
          {{ habit.name }}
        </span>
        <input
          v-if="isEditing"
          v-model="newName"
          :placeholder="habit.name"
          class="edit-input"
        />
      </div>
    </div>

    <!-- Habit actions: Edit, Stop, Delete -->
    <div class="action-buttons">
      <button @click="editHabit" class="edit-button">
        {{ isEditing ? 'Save' : 'Edit' }}
      </button>
      <button @click="stopHabit" class="stop-button">Stop</button>
      <button @click="removeHabit" class="delete-button">Delete</button>
    </div>
  </div>
</template>

<style scoped>
/* Habit item styling */
.habit-item {
  background-color: white;
  padding: 16px;
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.habit-checkbox {
  transition: transform 0.3s ease-in-out;
  height: 30px;
  width: 30px;
}

.completed {
  text-decoration: line-through;
  color: #3f453d;
}

.edit-input {
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  margin-top: 8px;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.edit-button,
.stop-button,
.delete-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-button {
  background-color: #3b82f6; /* Blue color */
  color: white;
  border: none;
}

.stop-button {
  background-color: #f59e0b; /* Yellow color */
  color: white;
  border: none;
}

.delete-button {
  background-color: #f87171; /* Red color */
  color: white;
  border: none;
}
</style>
