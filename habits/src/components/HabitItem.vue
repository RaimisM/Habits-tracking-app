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
const isActionVisible = ref(false)  // State to control the visibility of action buttons

// Computed property to determine if habit is completed for the selected date
const isCompletedForSelectedDate = computed(() => {
  return props.habit.completedDates && 
         props.habit.completedDates.includes(store.selectedDate);
})

// Update habit completion status for the specific date
const updateHabitStatus = () => {
  store.updateHabitStatusForDate(
    props.habit.id, 
    store.selectedDate, 
    !isCompletedForSelectedDate.value
  )
}

// Remove habit from the list
const removeHabit = () => {
  store.removeHabit(props.habit.id)
}

// Stop the habit
const stopHabit = () => {
  const stopDate = store.selectedDate
  console.log(`Stop Habit triggered for habit ID ${props.habit.id} with stop date: ${stopDate}`);
  store.stopHabit(props.habit.id, stopDate);
}

// Edit habit
const editHabit = () => {
  if (isEditing.value) {
    store.updateHabitName(props.habit.id, newName.value)
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}

// Toggle visibility of action buttons
const toggleActionVisibility = () => {
  isActionVisible.value = !isActionVisible.value;
}

// Visibility logic to show habit based on stop date
const isHabitVisible = computed(() => {
  if (!props.habit.stoppedDate) {
    return true
  }
  const selectedDateObj = new Date(store.selectedDate)
  const stoppedDateObj = new Date(props.habit.stoppedDate)
  selectedDateObj.setHours(0, 0, 0, 0)
  stoppedDateObj.setHours(0, 0, 0, 0)
  return selectedDateObj <= stoppedDateObj
})

// Computed property to determine the current streak and message
const streakMessage = computed(() => {
  if (!isCompletedForSelectedDate.value) {
    return '';  // Don't show streak message if habit is not completed today
  }

  // Get the last completed dates
  const completedDates = props.habit.completedDates.sort((a, b) => new Date(b) - new Date(a));
  
  // Check for streak
  let streak = 1;  // Current streak starts at 1 because we know the habit is completed today
  for (let i = 1; i < completedDates.length; i++) {
    const diff = (new Date(completedDates[i - 1]) - new Date(completedDates[i])) / (1000 * 3600 * 24); // Difference in days
    if (diff === 1) {
      streak++;
    } else {
      break; // If the difference is not 1, the streak is broken
    }
  }
  
  // Only show message if streak is 3 or more days
  if (streak >= 3) {
    return `Congrats! You've completed your habit for ${streak} consecutive days!`;
  }
  return '';  // Return empty if streak is less than 3 days
})
</script>

<template>
  <div v-if="isHabitVisible" class="habit-item">
    <!-- Habit content container -->
    <div class="habit-content">
      <div class="habit-name">
        <input
          type="checkbox"
          :checked="isCompletedForSelectedDate"
          @change="updateHabitStatus"
          class="habit-checkbox"
        />
        <div>
          <span v-if="!isEditing" :class="{ 'completed': isCompletedForSelectedDate }">
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

    <!-- Display streak message only if streak is 3 or more days -->
    <div v-if="streakMessage" class="streak-message">
      <span>{{ streakMessage }}</span>
    </div>
  </div>
</template>

<style scoped>
.streak-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

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
  width: 90%;
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
