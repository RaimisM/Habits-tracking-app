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
    
    // New getter to check if a habit is completed for a specific date
    isHabitCompletedForDate: (state) => (habitId, date) => {
      const habit = state.habits.find(h => h.id === habitId);
      return habit && habit.completedDates && habit.completedDates.includes(date);
    },
  },

  actions: {
    // Added this method to set the selected date
    setSelectedDate(date) {
      this.selectedDate = date;
    },
    
    loadHabits() {
      const storedHabits = JSON.parse(localStorage.getItem('habits')) || []
      
      // Migration: convert old habits to new format with completedDates array
      storedHabits.forEach(habit => {
        if (!habit.completedDates) {
          habit.completedDates = [];
          // If the habit was previously marked as completed, add the current date
          // to maintain backward compatibility
          if (habit.completed) {
            habit.completedDates.push(this.selectedDate);
          }
          // Remove the old completed property
          delete habit.completed;
        }
      });
      
      this.habits = storedHabits;
      this.saveHabits(); // Save migrated data
    },

    addHabit(habitName) {
      const newHabit = {
        id: Date.now(),
        name: habitName,
        completedDates: [], // Array to store dates when habit was completed
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

    // New method to update habit completion status for a specific date
    updateHabitStatusForDate(habitId, date, isCompleted) {
      const habit = this.habits.find(h => h.id === habitId);
      if (habit) {
        // Initialize completedDates array if it doesn't exist
        if (!habit.completedDates) {
          habit.completedDates = [];
        }
        
        // Get index of date in completedDates array (if it exists)
        const dateIndex = habit.completedDates.indexOf(date);
        
        if (isCompleted && dateIndex === -1) {
          // Add date to completedDates if it should be completed and isn't already
          habit.completedDates.push(date);
        } else if (!isCompleted && dateIndex !== -1) {
          // Remove date from completedDates if it shouldn't be completed but is
          habit.completedDates.splice(dateIndex, 1);
        }
        
        this.saveHabits();
      }
    },
    
    // Keep the old method for backward compatibility, but implement it using the new method
    updateHabitStatus(id, completed) {
      this.updateHabitStatusForDate(id, this.selectedDate, completed);
    },

    saveHabits() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    },
  },
  persist: true,
})