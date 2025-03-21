<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitStore } from '../store/habits'
import HabitItem from './HabitItem.vue' // Import component

const store = useHabitStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])

const habits = computed(() => store.getHabitsForDate(selectedDate.value))

onMounted(() => {
  store.loadHabits() // Load habits on mount
})
</script>

<template>
  <div>
    <h2>Your habits:</h2>



    <transition-group name="fade-list" tag="div">
      <HabitItem v-for="habit in habits" :key="habit.id" :habit="habit" />
    </transition-group>

    <p v-if="habits.length === 0">No habits added yet.</p>
  </div>
</template>

<style scoped>

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
