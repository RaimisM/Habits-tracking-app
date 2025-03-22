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
const isActionVisible = ref(false)  // New state to control the visibility of action buttons

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

// Add function to toggle action button visibility
const toggleActionVisibility = () => {
  isActionVisible.value = !isActionVisible.value;
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
    <!-- Habit content container -->
    <div class="habit-content">
      <!-- Habit name with edit functionality -->
      <div class="habit-name">
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

      <!-- Replace hamburger button with SVG image -->
      <button @click="toggleActionVisibility" class="hamburger-button">
        <img src="https://www.svgrepo.com/show/522527/edit-3.svg" alt="Edit Icon" width="24" height="24" />
      </button>
    </div>

    <!-- Habit actions: Edit, Stop, Delete -->
    <div v-if="isActionVisible" class="action-buttons">
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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

.habit-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.habit-name {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

/* Checkbox and Habit Name */
.habit-checkbox {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #124912;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}

.habit-checkbox:checked {
  background-color: #228c24;
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

/* Hamburger Menu Button */
.hamburger-button {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 30px;
  height: 20px;
  padding: 0;
  cursor: pointer;
}

.line {
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
}

/* Action Buttons - these will appear below the habit name in a row */
.action-buttons {
  display: flex;
  flex-direction: row;  /* Change to row to make buttons align horizontally */
  gap: 8px;
  margin-top: 10px; /* Adds space between habit content and action buttons */
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
