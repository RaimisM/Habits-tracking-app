import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0], // Store date as a string (yyyy-mm-dd)
  }),

  getters: {
    // Return habits filtered by the selected date
    getHabitsForDate: (state) => (date) => {
      return state.habits.filter((habit) => habit.date === date)
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
        date: new Date().toISOString().split('T')[0], // Save habit with current date
      }
      this.habits.push(newHabit)
      this.saveHabits() // Save to localStorage
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
