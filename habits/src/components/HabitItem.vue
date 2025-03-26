<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const props = defineProps({
  habit: Object,
  selectedDate: String,
})

const isEditing = ref(false)
const newName = ref(props.habit.name)
const isActionVisible = ref(false)
const isStopped = computed(() => !!props.habit.stoppedDate)

// stop date
const formattedStopDate = computed(() => {
  if (!props.habit.stoppedDate) return ''
  const date = new Date(props.habit.stoppedDate)
  return date.toISOString().split('T')[0]
})

const isCompletedForSelectedDate = computed(() => {
  return props.habit.completedDates && props.habit.completedDates.includes(store.selectedDate)
})

const updateHabitStatus = () => {
  // Prevent updating status if stopped
  if (isStopped.value && new Date(store.selectedDate) <= new Date(props.habit.stoppedDate)) {
    return
  }
  store.updateHabitStatusForDate(
    props.habit.id,
    store.selectedDate,
    !isCompletedForSelectedDate.value,
  )
}

// Remove habit from the list
const removeHabit = () => {
  store.removeHabit(props.habit.id)
}

// Stop the habit
const stopHabit = () => {
  const stopDate = store.selectedDate
  store.stopHabit(props.habit.id, stopDate)
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

const toggleActionVisibility = () => {
  isActionVisible.value = !isActionVisible.value
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.habit-item')) {
    isActionVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Visibility logic
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

// Computed to check if checkbox should be disabled
const isCheckboxDisabled = computed(() => {
  return isStopped.value && new Date(store.selectedDate) <= new Date(props.habit.stoppedDate)
})

// streak message
const streakMessage = computed(() => {
  if (!props.habit.completedDates || !props.habit.completedDates.includes(store.selectedDate)) {
    return ''
  }

  const completedDates = props.habit.completedDates.sort((a, b) => new Date(b) - new Date(a))
  const selectedDateIndex = completedDates.findIndex((date) =>
    isSameDay(new Date(date), new Date(store.selectedDate)),
  )

  if (selectedDateIndex === -1) {
    return ''
  }

  let streak = 1
  for (let i = selectedDateIndex + 1; i < completedDates.length; i++) {
    const diff =
      (new Date(completedDates[i - 1]) - new Date(completedDates[i])) / (1000 * 3600 * 24)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }

  return streak >= 3 ? `You've completed your habit for ${streak} consecutive days!` : ''
})

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
</script>

<template>
  <div v-if="isHabitVisible" :class="{ 'habit-item': true, stopped: isStopped }">
    <div class="habit-content">
      <div class="habit-name">
        <input
          type="checkbox"
          :checked="isCompletedForSelectedDate"
          @change="updateHabitStatus"
          class="habit-checkbox"
          :disabled="isCheckboxDisabled"
        />
        <div>
          <span v-if="!isEditing" :class="{ completed: isCompletedForSelectedDate }">
            {{ habit.name }}
          </span>
          <input v-if="isEditing" v-model="newName" :placeholder="habit.name" class="edit-input" />
        </div>
      </div>

      <button @click="toggleActionVisibility" class="hamburger-button">
        <img
          src="https://www.svgrepo.com/show/522527/edit-3.svg"
          alt="Edit Icon"
          width="24"
          height="24"
        />
      </button>
    </div>

    <div v-if="isActionVisible" class="action-buttons">
      <button @click="editHabit" class="edit-button">
        {{ isEditing ? 'Save' : 'Edit' }}
      </button>
      <button @click="stopHabit" class="stop-button">Stop</button>
      <button @click="removeHabit" class="delete-button">Delete</button>
    </div>

    <div v-if="streakMessage" class="streak-message">
      <span>{{ streakMessage }}</span>
    </div>

    <div v-if="isStopped" class="stopped-message">
      This habit was stopped on {{ formattedStopDate }}
    </div>
  </div>
</template>

<style scoped>
.streak-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}
.stopped-message {
  color: rgb(174, 2, 2);
  font-size: 10px;
}
.habit-item.stopped {
  background-color: rgb(198, 199, 199);
}

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
  max-width: 400px;
}

.habit-name {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
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
  flex-shrink: 0;
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
  color: #424242;
  font-style: italic;
}

.habit-name div {
  flex-grow: 1;
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
}

.edit-input {
  width: 100%;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
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

.action-buttons {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 10px;
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
