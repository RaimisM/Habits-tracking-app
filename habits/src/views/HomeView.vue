<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHabitStore } from '../store/habits'
import DayNavigator from '../components/DayNavigator.vue'
import HabitList from '../components/HabitList.vue'

const route = useRoute()
const store = useHabitStore()

onMounted(() => {
  if (route.params.date) {
    store.selectedDate = route.params.date
  }
})

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate) {
      store.selectedDate = newDate
    }
  }
)
</script>

<template>
  <div>
    <DayNavigator />
    <HabitList />
  </div>
</template>