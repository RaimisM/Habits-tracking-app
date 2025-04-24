import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHabitStore } from '../habits'


describe('Habit Store - Streak Getters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns 0 streak when habit does not exist', () => {
    const store = useHabitStore()
    expect(store.getCurrentStreak(999, '2025-04-24')).toBe(0)
  })

  it('returns correct current streak up to a date', () => {
    const store = useHabitStore()
    store.habits = [
      {
        id: 1,
        name: 'Daily Walk',
        date: '2025-04-20',
        completedDates: ['2025-04-22', '2025-04-23', '2025-04-24'],
        active: true,
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0,
      },
    ]

    expect(store.getCurrentStreak(1, '2025-04-24')).toBe(2)
  })

  it('returns 0 current streak if upToDate is not in completedDates', () => {
    const store = useHabitStore()
    store.habits = [
      {
        id: 2,
        name: 'Meditation',
        date: '2025-04-20',
        completedDates: ['2025-04-22', '2025-04-23'],
        active: true,
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0,
      },
    ]

    expect(store.getCurrentStreak(2, '2025-04-24')).toBe(0)
  })

  it('returns longest streak from completedDates', () => {
    const store = useHabitStore()
    store.habits = [
      {
        id: 3,
        name: 'Reading',
        date: '2025-04-15',
        completedDates: [
          '2025-04-15',
          '2025-04-16',
          '2025-04-18',
          '2025-04-19',
          '2025-04-20',
          '2025-04-21',
        ],
        active: true,
        stoppedDate: null,
        longestStreak: 0,
        lastStreakCalculation: 0,
      },
    ]

    expect(store.getLongestStreak(3)).toBe(4) // 18,19,20,21
  })

  it('caches longest streak when no new dates are added', () => {
    const store = useHabitStore()
    store.habits = [
      {
        id: 4,
        name: 'Yoga',
        date: '2025-04-10',
        completedDates: ['2025-04-10', '2025-04-11', '2025-04-12'],
        active: true,
        stoppedDate: null,
        longestStreak: 3,
        lastStreakCalculation: 3,
      },
    ]

    // should return cached value
    expect(store.getLongestStreak(4)).toBe(3)
  })

  describe('Habit Store - getHabitsForDate', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
    })
  
    it('returns habits active on the selected date', () => {
      const store = useHabitStore()
      store.habits = [
        {
          id: 1,
          name: 'Read',
          date: '2025-04-20',
          completedDates: [],
          active: true,
          stoppedDate: null,
          longestStreak: 0,
          lastStreakCalculation: 0,
        },
        {
          id: 2,
          name: 'Run',
          date: '2025-04-22',
          completedDates: [],
          active: true,
          stoppedDate: '2025-04-23',
          longestStreak: 0,
          lastStreakCalculation: 0,
        },
        {
          id: 3,
          name: 'Meditate',
          date: '2025-04-25',
          completedDates: [],
          active: true,
          stoppedDate: null,
          longestStreak: 0,
          lastStreakCalculation: 0,
        },
      ]
  
      const results = store.getHabitsForDate('2025-04-23')
      expect(results.map((h) => h.name)).toContain('Read')
      expect(results.map((h) => h.name)).toContain('Run')
      expect(results.map((h) => h.name)).not.toContain('Meditate')
    })
  })
  describe('Habit Store - updateHabitStatusForDate', () => {
    beforeEach(() => {
      setActivePinia(createPinia())
      // optional: mock localStorage to prevent errors
      globalThis.localStorage = {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        key: vi.fn(),
        length: 0,
      }
    })
  
    it('adds date to completedDates when marked completed', () => {
      const store = useHabitStore()
      store.habits = [
        {
          id: 1,
          name: 'Read',
          date: '2025-04-20',
          completedDates: [],
          active: true,
          stoppedDate: null,
          longestStreak: 0,
          lastStreakCalculation: 0,
        },
      ]
  
      store.updateHabitStatusForDate(1, '2025-04-24', true)
  
      expect(store.habits[0].completedDates).toContain('2025-04-24')
      expect(store.habits[0].lastStreakCalculation).toBe(null)
    })
  
    it('removes date from completedDates when marked incomplete', () => {
      const store = useHabitStore()
      store.habits = [
        {
          id: 2,
          name: 'Exercise',
          date: '2025-04-20',
          completedDates: ['2025-04-24'],
          active: true,
          stoppedDate: null,
          longestStreak: 2,
          lastStreakCalculation: 2,
        },
      ]
  
      store.updateHabitStatusForDate(2, '2025-04-24', false)
  
      expect(store.habits[0].completedDates).not.toContain('2025-04-24')
      expect(store.habits[0].lastStreakCalculation).toBe(null)
    })
  })
  
})
