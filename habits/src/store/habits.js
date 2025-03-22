import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0], // Store date as a string (yyyy-mm-dd)
  }),

  getters: {
    // Get habits for the selected date
    getHabitsForDate: (state) => (date) => {
      // Convert the selected date to a Date object and normalize to midnight
      const selectedDateObj = new Date(date);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      return state.habits.filter((habit) => {
        // Convert the habit's creation date to a Date object
        const habitStartDateObj = new Date(habit.date);
        habitStartDateObj.setHours(0, 0, 0, 0);
        
        // If the habit has been stopped, get the stop date
        let stopDateObj = null;
        if (habit.stoppedDate) {
          stopDateObj = new Date(habit.stoppedDate);
          stopDateObj.setHours(0, 0, 0, 0);
        }
        
        // FIXED LOGIC: 
        // 1. The habit should be visible if it was created on or before the selected date
        // 2. AND if it doesn't have a stop date OR the selected date is LESS THAN OR EQUAL TO the stop date
        //    (this ensures the habit is visible on the stop date itself)
        return (
          habitStartDateObj <= selectedDateObj && 
          (!stopDateObj || selectedDateObj <= stopDateObj)
        );
      });
    },
  },

  actions: {
    // Added this method to set the selected date
    setSelectedDate(date) {
      this.selectedDate = date;
    },
    
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
        // Set the stoppedDate to the current selected date
        habit.stoppedDate = stoppedDate;
        habit.active = false; // Set the habit as inactive
        this.saveHabits(); // Save changes
        console.log(`Stopped habit ${habit.name} on date ${stoppedDate}`); // Debug log
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