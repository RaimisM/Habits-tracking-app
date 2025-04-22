<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitTracker from './HabitTracker.vue'
import { HabitItemProps } from '../types'

const props = defineProps<HabitItemProps>()
const store = useHabitStore()
const isEditing = ref(false)
const newName = ref(props.habit.name)
const isActionVisible = ref(false)
const isStopped = computed(() => !!props.habit.stoppedDate)

const formattedStopDate = computed(() => {
  if (!props.habit.stoppedDate) return ''
  const date = new Date(props.habit.stoppedDate)
  return date.toISOString().split('T')[0]
})

const isCompletedForSelectedDate = computed(() => {
  return props.habit.completedDates && props.habit.completedDates.includes(store.selectedDate)
})

const updateHabitStatus = () => {
  if (
    isStopped.value &&
    new Date(store.selectedDate) <= new Date(props.habit.stoppedDate as string)
  ) {
    return
  }
  store.updateHabitStatusForDate(
    props.habit.id,
    store.selectedDate,
    !isCompletedForSelectedDate.value,
  )
}

const removeHabit = () => {
  store.removeHabit(props.habit.id)
}

const stopHabit = () => {
  const stopDate = store.selectedDate
  store.stopHabit(props.habit.id, stopDate)
}

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

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.habit-item')) {
    isActionVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

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

const isCheckboxDisabled = computed(() => {
  return (
    isStopped.value && new Date(store.selectedDate) <= new Date(props.habit.stoppedDate as string)
  )
})
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

    <HabitTracker :habit="habit" />

    <div v-if="isStopped" class="stopped-message">
      This habit was stopped on {{ formattedStopDate }}
    </div>
  </div>
</template>

<style scoped>
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
