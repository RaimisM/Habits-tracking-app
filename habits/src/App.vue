<script setup>
import { useHabitStore } from '../src/store/habits.js'
import { onMounted } from 'vue'

const store = useHabitStore()

onMounted(() => {
  store.loadHabits()
})
</script>

<template>
  <router-view />
</template>
