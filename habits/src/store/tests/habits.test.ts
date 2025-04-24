import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHabitStore } from '../habits'



describe('Habit Store Tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const localStorageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value.toString()
        }),
        clear: vi.fn(() => {
          store = {}
        })
      }
    })()
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    })
  })

  describe('getCurrentStreak', () => {
    it('should calculate current streak correctly', () => {
      const store = useHabitStore()
      
      store.habits = [{
        id: 1,
        name: 'Test Habit',
        completedDates: [
          '2025-01-01',
          '2025-01-02',
          '2025-01-03',
          '2025-01-04',

          '2025-01-07',
          '2025-01-08',
          '2025-01-09'
        ],
        active: true,
        date: '2025-01-01',
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0
      }]
      expect(store.getCurrentStreak(1, '2025-01-10')).toBe(0)
      
      expect(store.getCurrentStreak(1, '2025-01-09')).toBe(2)
      
      expect(store.getCurrentStreak(1, '2025-01-04')).toBe(3)
      
      expect(store.getCurrentStreak(1, '2025-01-07')).toBe(0)
      
      expect(store.getCurrentStreak(999, '2025-01-09')).toBe(0)
    })
  })

  describe('updateHabitStatusForDate', () => {
    it('should correctly update habit completion status for a specific date', () => {
      const store = useHabitStore()
      const mockSaveHabits = vi.fn()
      store.saveHabits = mockSaveHabits
      
      const habitId = 1
      const testDate = '2025-01-15'
      
      store.habits = [{
        id: habitId,
        name: 'Test Habit',
        completedDates: ['2025-01-10', '2025-01-11'],
        active: true,
        date: '2025-01-01',
        stoppedDate: null,
        longestStreak: 2,
        lastStreakCalculation: 2
      }]
      
      store.updateHabitStatusForDate(habitId, testDate, true)
      
      const updatedHabit = store.habits.find(h => h.id === habitId)
      expect(updatedHabit).toBeDefined()
      expect(updatedHabit?.completedDates).toContain(testDate)
      expect(updatedHabit?.completedDates.length).toBe(3)
      expect(updatedHabit?.lastStreakCalculation).toBeNull()
      expect(mockSaveHabits).toHaveBeenCalledTimes(1)
      
      store.updateHabitStatusForDate(habitId, testDate, false)
      
      const reUpdatedHabit = store.habits.find(h => h.id === habitId)
      expect(reUpdatedHabit).toBeDefined()
      expect(reUpdatedHabit?.completedDates).not.toContain(testDate)
      expect(reUpdatedHabit?.completedDates.length).toBe(2)
      expect(reUpdatedHabit?.lastStreakCalculation).toBeNull()
      expect(mockSaveHabits).toHaveBeenCalledTimes(2)
      
      store.updateHabitStatusForDate(999, testDate, true)
      
      expect(store.habits.length).toBe(1)
      expect(mockSaveHabits).toHaveBeenCalledTimes(3)
    })
  })
})