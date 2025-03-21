<script setup>
import { useHabitStore } from '../store/habits'

const store = useHabitStore()
const props = defineProps({
  habit: Object,
})

const updateHabitStatus = () => {
  store.updateHabitStatus(props.habit.id, props.habit.completed)
}

const removeHabit = () => {
  store.removeHabit(props.habit.id)
}
</script>

<template>
  <div>
    <div>
      <input type="checkbox" v-model="habit.completed" @change="updateHabitStatus" />
      <span :class="{ 'completed': habit.completed }">{{ habit.name }}</span>
    </div>
    <button @click="removeHabit">Delete</button>
  </div>
</template>

<style scoped>
/* Transition effect for checkbox */
input[type='checkbox'] {
  transition:
    transform 0.3s ease-in-out,
    background-color 0.2s ease-in-out;
}

/* Styling for completed habit */
.completed {
  text-decoration: line-through;
  color: #9ca3af; /* Gray color equivalent to text-gray-400 in Tailwind */
}
</style>
