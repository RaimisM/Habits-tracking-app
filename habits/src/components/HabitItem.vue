<script setup>
import { ref, computed } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const props = defineProps({
  habit: Object,
  selectedDate: String, // Accept selectedDate from parent (App.vue)
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
  // Use the current selected date from the store as the stop date
  const stopDate = store.selectedDate
  console.log(`Stop Habit triggered for habit ID ${props.habit.id} with stop date: ${stopDate}`); // Debug log
  store.stopHabit(props.habit.id, stopDate);
}

// Add function to edit habit
const editHabit = () => {
  if (isEditing.value) {
    // Save the new name
    store.updateHabitName(props.habit.id, newName.value)
    isEditing.value = false
  } else {
    // Enter edit mode
    isEditing.value = true
  }
}

// Fix visibility logic
const isHabitVisible = computed(() => {
  if (!props.habit.stoppedDate) {
    // If habit is not stopped, always show it
    return true
  }
  
  // Convert dates to comparable format 
  const selectedDateObj = new Date(store.selectedDate)
  const stoppedDateObj = new Date(props.habit.stoppedDate)
  
  // Reset time parts to compare just the dates
  selectedDateObj.setHours(0, 0, 0, 0)
  stoppedDateObj.setHours(0, 0, 0, 0)
  
  // Show habit if selected date is on or before the stopped date
  return selectedDateObj <= stoppedDateObj
})
</script>

<template>
  <div v-if="isHabitVisible" class="habit-item">
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
