<script setup>
import { ref, onMounted } from 'vue'
import { useHabitStore } from './store/habits'
import HabitList from './components/HabitList.vue'
import DayNavigator from './components/DayNavigator.vue'
import AddHabit from './components/AddHabit.vue'

const store = useHabitStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])

onMounted(() => {
  console.log('App mounted - Loading habits')
  store.loadHabits()
  store.loadStoppedHabitState()
})

const updateSelectedDate = (newDate) => {
  console.log(`Selected date changed: ${newDate}`)
  selectedDate.value = newDate
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Habit Tracker</h1>
    </header>

    <main>
      <DayNavigator :selectedDate="selectedDate" @dateChanged="updateSelectedDate" />

      <AddHabit />

      <HabitList :selectedDate="selectedDate" />
    </main>
  </div>
</template>

<style scoped>
#app {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
}

header {
  margin-bottom: 20px;
}

main {
  margin-top: 20px;
}
</style>
