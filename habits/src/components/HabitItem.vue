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
/* Habit Item Container */
.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.habit-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Checkbox and Habit Name */
.habit-item > div:first-child {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.habit-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #4a90e2;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.habit-checkbox:checked {
  background-color: #4a90e2;
}

.habit-checkbox:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  left: 4px;
  top: -1px;
}

.completed {
  text-decoration: line-through;
  color: #888888;
}

.edit-input {
  padding: 6px 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button {
  background-color: #4a90e2;
  color: white;
}

.edit-button:hover {
  background-color: #3a80d2;
}

.stop-button {
  background-color: #f5a623;
  color: white;
}

.stop-button:hover {
  background-color: #e59613;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #d73c2c;
}
</style>
