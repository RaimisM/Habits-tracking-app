import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0], // Store date as a string (yyyy-mm-dd)
  }),

  getters: {
    // Get habits for the selected date
    getHabitsForDate: (state) => (date) => {
      return state.habits.filter((habit) => habit.active && habit.date <= date)
    },
  },

  actions: {
    loadHabits() {
      const storedHabits = JSON.parse(localStorage.getItem('habits')) || []
      this.habits = storedHabits
    },

    addHabit(habitName) {
      const newHabit = {
        id: Date.now(),
        name: habitName,
        completed: false,
        active: true, // Default to active
        date: new Date().toISOString().split('T')[0], // Store with current date
      }
      this.habits.push(newHabit)
      this.saveHabits()
    },

    updateHabitName(id, newName) {
      const habit = this.habits.find((h) => h.id === id)
      if (habit) {
        habit.name = newName
        this.saveHabits()
      }
    },

    stopHabit(id) {
      const habit = this.habits.find((h) => h.id === id)
      if (habit) {
        habit.active = false // Marks habit as stopped but retains past data
        this.saveHabits()
      }
    },

    removeHabit(id) {
      this.habits = this.habits.filter((habit) => habit.id !== id)
      this.saveHabits()
    },

    updateHabitStatus(id, completed) {
      const habit = this.habits.find((h) => h.id === id)
      if (habit) {
        habit.completed = completed
        this.saveHabits()
      }
    },

    saveHabits() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    },
  },
  persist: true,
})
