import { defineStore } from 'pinia'
import { Habit } from '../types'

interface HabitState {
  habits: Habit[]
  selectedDate: string
}

// Define types for the getters using proper Pinia constraints
// Use underscore prefix for unused parameters to avoid ESLint errors
type HabitGetters = {
  getHabitsForDate: (_state: HabitState) => (_date: string) => Habit[]
  isHabitCompletedForDate: (_state: HabitState) => (_habitId: number, _date: string) => boolean
  getCurrentStreak: (_state: HabitState) => (_habitId: number, _upToDate: string) => number
  getLongestStreak: (_state: HabitState) => (_habitId: number) => number
  isLongestStreak: (_state: HabitState) => (_habitId: number, _upToDate: string) => boolean
  [key: string]: (_state: HabitState) => any // Index signature to satisfy _GettersTree constraint
}

// Define a type for the actions
interface HabitActions {
  updateHabitName(_habitId: number, _newName: string): void
  setSelectedDate(_date: string): void
  loadHabits(): void
  addHabit(_habitName: string): void
  stopHabit(_habitId: number, _stoppedDate: string): void
  removeHabit(_id: number): void
  updateHabitStatusForDate(_habitId: number, _date: string, _isCompleted: boolean): void
  updateHabitStatus(_id: number, _completed: boolean): void
  saveHabits(): void
  loadStoppedHabitState(): void
}

export const useHabitStore = defineStore<'habits', HabitState, HabitGetters, HabitActions>(
  'habits',
  {
    state: (): HabitState => ({
      habits: [],
      selectedDate: new Date().toISOString().split('T')[0],
    }),

    getters: {
      getHabitsForDate:
        (state) =>
        (date: string): Habit[] => {
          const selectedDateObj = new Date(date)
          selectedDateObj.setHours(0, 0, 0, 0)

          return state.habits.filter((habit) => {
            const habitStartDateObj = new Date(habit.date)
            habitStartDateObj.setHours(0, 0, 0, 0)

            let stopDateObj: Date | null = null
            if (habit.stoppedDate) {
              stopDateObj = new Date(habit.stoppedDate)
              stopDateObj.setHours(0, 0, 0, 0)
            }

            return (
              habitStartDateObj <= selectedDateObj &&
              (!stopDateObj || selectedDateObj <= stopDateObj)
            )
          })
        },

      isHabitCompletedForDate:
        (state) =>
        (habitId: number, date: string): boolean => {
          const habit = state.habits.find((h) => h.id === habitId)
          return habit !== undefined && habit.completedDates && habit.completedDates.includes(date)
        },

      getCurrentStreak:
        (state) =>
        (habitId: number, upToDate: string): number => {
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

      getLongestStreak:
        (state) =>
        (habitId: number): number => {
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
          let previousDate: Date | null = null

          for (const date of [...habit.completedDates].sort()) {
            const currentDate = new Date(date)

            if (!previousDate) {
              currentStreak = 1
            } else {
              const diffDays =
                (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)

              if (diffDays === 1) {
                currentStreak++
              } else if (diffDays > 1) {
                currentStreak = 1
              }
            }

            longestStreak = Math.max(longestStreak, currentStreak)
            previousDate = currentDate
          }

          // Using type assertion to avoid error with state mutation in getter
          ;(state.habits as Habit[]) = state.habits.map((h) =>
            h.id === habitId
              ? { ...h, longestStreak, lastStreakCalculation: h.completedDates.length }
              : h,
          )

          return longestStreak
        },

      isLongestStreak:
        (_state) =>
        (habitId: number, upToDate: string): boolean => {
          // Fixed version - we need to use store access pattern instead
          const store = useHabitStore()
          const currentStreak = store.getCurrentStreak(habitId, upToDate)
          const longestStreak = store.getLongestStreak(habitId)
          return currentStreak >= 3 && currentStreak === longestStreak
        },
    },

    actions: {
      updateHabitName(habitId: number, newName: string): void {
        this.habits = this.habits.map((habit) =>
          habit.id === habitId ? { ...habit, name: newName } : habit,
        )
        this.saveHabits()
      },

      setSelectedDate(date: string): void {
        this.selectedDate = date
      },

      loadHabits(): void {
        const savedHabits = localStorage.getItem('habits')
        this.habits = savedHabits ? JSON.parse(savedHabits) : []
        this.habits = this.habits.map((habit) => ({
          ...habit,
          completedDates: habit.completedDates || [],
        }))
        this.saveHabits()
      },

      addHabit(habitName: string): void {
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

      stopHabit(habitId: number, stoppedDate: string): void {
        this.habits = this.habits.map((h) =>
          h.id === habitId ? { ...h, stoppedDate, active: false } : h,
        )
        this.saveHabits()
        localStorage.setItem(`habit-${habitId}-stopped`, stoppedDate)
      },

      removeHabit(id: number): void {
        this.habits = this.habits.filter((habit) => habit.id !== id)
        this.saveHabits()
      },

      updateHabitStatusForDate(habitId: number, date: string, isCompleted: boolean): void {
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

      updateHabitStatus(id: number, completed: boolean): void {
        this.updateHabitStatusForDate(id, this.selectedDate, completed)
      },

      saveHabits(): void {
        localStorage.setItem('habits', JSON.stringify(this.habits))
      },

      loadStoppedHabitState(): void {
        this.habits = this.habits.map((habit) => {
          const stoppedDate = localStorage.getItem(`habit-${habit.id}-stopped`)
          return stoppedDate ? { ...habit, stoppedDate, active: false } : habit
        })
      },
    },
  },
)
