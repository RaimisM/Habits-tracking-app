<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useHabitStore } from '../store/habits'
import DayNavigator from '../components/DayNavigator.vue'
import HabitList from '../components/HabitList.vue'

const route = useRoute()
const router = useRouter()
const store = useHabitStore()
const today = dayjs().format('YYYY-MM-DD')

const isValidDate = (dateString) => {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) return false;
  
  const date = dayjs(dateString);
  return date.isValid() && date.format('YYYY-MM-DD') === dateString;
}

onMounted(() => {
  if (route.params.date) {
    if (isValidDate(route.params.date)) {
      store.selectedDate = route.params.date;
    } else {
      alert('Invalid date detected in URL. Redirecting to today\'s date.');
      store.selectedDate = today;
      router.push(`/day/${today}`);
    }
  }
})

watch(
  () => route.params.date,
  (newDate) => {
    if (newDate) {
      if (isValidDate(newDate)) {
        store.selectedDate = newDate;
      } else {
        alert('Invalid date detected. Redirecting to today\'s date.');
        store.selectedDate = today;
        router.push(`/day/${today}`);
      }
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