import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0], // Store date as a string (yyyy-mm-dd)
  }),

  getters: {
    // Get habits for the selected date
    getHabitsForDate: (state) => (date) => {
      const selectedDateObj = new Date(date)
      selectedDateObj.setHours(0, 0, 0, 0)

      return state.habits.filter((habit) => {
        const habitStartDateObj = new Date(habit.date)
        habitStartDateObj.setHours(0, 0, 0, 0)

        let stopDateObj = null
        if (habit.stoppedDate) {
          stopDateObj = new Date(habit.stoppedDate)
          stopDateObj.setHours(0, 0, 0, 0)
        }

        return (
          habitStartDateObj <= selectedDateObj && (!stopDateObj || selectedDateObj <= stopDateObj)
        )
      })
    },

    isHabitCompletedForDate: (state) => (habitId, date) => {
      const habit = state.habits.find((h) => h.id === habitId)
      return habit && habit.completedDates && habit.completedDates.includes(date)
    },

    getCurrentStreak: (state) => (habitId, upToDate) => {
      const habit = state.habits.find((h) => h.id === habitId)
      if (!habit || !habit.completedDates || habit.completedDates.length === 0) {
        return 0
      }

      const sortedDates = [...habit.completedDates].sort()
      const targetDate = new Date(upToDate)
      targetDate.setHours(0, 0, 0, 0)

      let streak = 0
      let currentDate = new Date(targetDate)

      if (!habit.completedDates.includes(upToDate)) {
        return 0 // If the target date isn't completed, streak is 0
      }

      while (true) {
        const dateString = currentDate.toISOString().split('T')[0]

        if (habit.completedDates.includes(dateString)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)

          const habitStartDate = new Date(habit.date)
          habitStartDate.setHours(0, 0, 0, 0)
          if (currentDate < habitStartDate) {
            break
          }
        } else {
          break
        }
      }

      return streak
    },

    getLongestStreak: (state) => (habitId) => {
      const habit = state.habits.find((h) => h.id === habitId)
      if (!habit || !habit.completedDates || habit.completedDates.length === 0) {
        return 0
      }

      if (
        habit.longestStreak !== undefined &&
        habit.lastStreakCalculation &&
        habit.lastStreakCalculation === habit.completedDates.length
      ) {
        return habit.longestStreak
      }

      const sortedDates = [...habit.completedDates].sort()

      let longestStreak = 0
      let currentStreak = 0
      let previousDate = null

      for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i])

        if (previousDate === null) {
          currentStreak = 1
        } else {
          const diffTime = currentDate - previousDate
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

          if (diffDays === 1) {
            currentStreak++
          } else if (diffDays === 0) {
            continue
          } else {
            currentStreak = 1
          }
        }

        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }

        previousDate = currentDate
      }

      habit.longestStreak = longestStreak
      habit.lastStreakCalculation = habit.completedDates.length

      return longestStreak
    },

    isLongestStreak: (state, getters) => (habitId, upToDate) => {
      const currentStreak = getters.getCurrentStreak(habitId, upToDate)
      const longestStreak = getters.getLongestStreak(habitId)
      return currentStreak >= 3 && currentStreak === longestStreak
    },
  },

  actions: {
    setSelectedDate(date) {
      this.selectedDate = date
    },

    loadHabits() {
      const storedHabits = JSON.parse(localStorage.getItem('habits')) || []

      storedHabits.forEach((habit) => {
        if (!habit.completedDates) {
          habit.completedDates = []
          if (habit.completed) {
            habit.completedDates.push(this.selectedDate)
          }
          delete habit.completed
        }
      })

      this.habits = storedHabits
      this.saveHabits()
    },

    addHabit(habitName) {
      const newHabit = {
        id: Date.now(),
        name: habitName,
        completedDates: [],
        active: true,
        date: new Date().toISOString().split('T')[0],
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0,
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
      const habit = this.habits.find((h) => h.id === habitId)
      if (habit) {
        habit.stoppedDate = stoppedDate
        habit.active = false
        this.saveHabits()

        // Save stopped state in localStorage to persist it across reloads
        localStorage.setItem(`habit-${habitId}-stopped`, stoppedDate)

        console.log(`Stopped habit ${habit.name} on date ${stoppedDate}`)
      }
    },

    removeHabit(id) {
      this.habits = this.habits.filter((habit) => habit.id !== id)
      this.saveHabits()
    },

    updateHabitStatusForDate(habitId, date, isCompleted) {
      const habit = this.habits.find((h) => h.id === habitId)
      if (habit) {
        if (!habit.completedDates) {
          habit.completedDates = []
        }

        const dateIndex = habit.completedDates.indexOf(date)

        if (isCompleted && dateIndex === -1) {
          habit.completedDates.push(date)
          habit.lastStreakCalculation = null
        } else if (!isCompleted && dateIndex !== -1) {
          habit.completedDates.splice(dateIndex, 1)
          habit.lastStreakCalculation = null
        }

        this.saveHabits()
      }
    },

    updateHabitStatus(id, completed) {
      this.updateHabitStatusForDate(id, this.selectedDate, completed)
    },

    saveHabits() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    },

    loadStoppedHabitState() {
      this.habits.forEach((habit) => {
        const stoppedDate = localStorage.getItem(`habit-${habit.id}-stopped`)
        if (stoppedDate) {
          habit.stoppedDate = stoppedDate
          habit.active = false
        }
      })
    },
  },

  persist: true,
})
