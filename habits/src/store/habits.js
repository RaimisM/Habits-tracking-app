import { defineStore } from 'pinia'

export const useHabitStore = defineStore('habits', {
  state: () => ({
    habits: [],
    selectedDate: new Date().toISOString().split('T')[0],
  }),

  getters: {
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

      const targetDate = new Date(upToDate)
      targetDate.setHours(0, 0, 0, 0)

      let streak = 0
      let currentDate = new Date(targetDate)

      if (!habit.completedDates.includes(upToDate)) {
        return 0
      }

      while (currentDate >= new Date(habit.date)) {
        const dateString = currentDate.toISOString().split('T')[0]

        if (habit.completedDates.includes(dateString)) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
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
        habit.lastStreakCalculation === habit.completedDates.length
      ) {
        return habit.longestStreak
      }

      let longestStreak = 0
      let currentStreak = 0
      let previousDate = null

      for (const date of [...habit.completedDates].sort()) {
        const currentDate = new Date(date)

        if (!previousDate) {
          currentStreak = 1
        } else {
          const diffDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24)

          if (diffDays === 1) {
            currentStreak++
          } else if (diffDays > 1) {
            currentStreak = 1
          }
        }

        longestStreak = Math.max(longestStreak, currentStreak)
        previousDate = currentDate
      }

      state.habits = state.habits.map((h) =>
        h.id === habitId ? { ...h, longestStreak, lastStreakCalculation: h.completedDates.length } : h
      )

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
      this.habits = JSON.parse(localStorage.getItem('habits')) || []
      this.habits = this.habits.map((habit) => ({
        ...habit,
        completedDates: habit.completedDates || [],
      }))
      this.saveHabits()
    },

    addHabit(habitName) {
      this.habits.push({
        id: Date.now(),
        name: habitName,
        completedDates: [],
        active: true,
        date: new Date().toISOString().split('T')[0],
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0,
      })
      this.saveHabits()
    },

    stopHabit(habitId, stoppedDate) {
      this.habits = this.habits.map((h) =>
        h.id === habitId ? { ...h, stoppedDate, active: false } : h
      )
      this.saveHabits()
      localStorage.setItem(`habit-${habitId}-stopped`, stoppedDate)
    },

    removeHabit(id) {
      this.habits = this.habits.filter((habit) => habit.id !== id)
      this.saveHabits()
    },

    updateHabitStatusForDate(habitId, date, isCompleted) {
      this.habits = this.habits.map((h) => {
        if (h.id === habitId) {
          const completedDates = new Set(h.completedDates)
          if (isCompleted) {
            completedDates.add(date)
          } else {
            completedDates.delete(date)
          }
          return { ...h, completedDates: Array.from(completedDates), lastStreakCalculation: null }
        }
        return h
      })
      this.saveHabits()
    },

    updateHabitStatus(id, completed) {
      this.updateHabitStatusForDate(id, this.selectedDate, completed)
    },

    saveHabits() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
    },

    loadStoppedHabitState() {
      this.habits = this.habits.map((habit) => {
        const stoppedDate = localStorage.getItem(`habit-${habit.id}-stopped`)
        return stoppedDate ? { ...habit, stoppedDate, active: false } : habit
      })
    },
  },

  persist: true,
})
