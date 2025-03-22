import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0], // Store date as a string (yyyy-mm-dd)
  }),

  getters: {
    // Get habits for the selected date
    getHabitsForDate: (state) => (date) => {
      const selectedDate = new Date(date).setHours(0, 0, 0, 0); // Normalize selected date to 00:00:00 for consistency
      return state.habits.filter((habit) => {
        const habitDate = new Date(habit.date).setHours(0, 0, 0, 0); // Normalize habit date
        const stopDate = habit.stoppedDate ? new Date(habit.stoppedDate).setHours(0, 0, 0, 0) : null;
    
        // Make sure the habit should be displayed based on date range
        return (
          habitDate <= selectedDate && // Show habits that started before or on the selected date
          (!stopDate || selectedDate <= stopDate) // Keep showing habits until the stop date
        );
      });
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
        stoppedDate: null, // Default to null
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

    stopHabit(habitId, stoppedDate) {
      const habit = this.habits.find(h => h.id === habitId);
      if (habit) {
        console.log(`Stopping habit ${habit.name} with stopped date ${stoppedDate}`); // Debug log
        habit.stoppedDate = stoppedDate; // Set the stoppedDate
        habit.active = false; // Set the habit as inactive
        this.saveHabits(); // Save changes
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
