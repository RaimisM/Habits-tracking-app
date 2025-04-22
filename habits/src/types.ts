export interface Habit {
    id: number;
    name: string;
    completedDates: string[];
    active: boolean;
    date: string;
    stoppedDate: string | null | undefined;
    longestStreak?: number;
    lastStreakCalculation?: number | null;
    [key: string]: any;
  }

  export interface HabitItemProps {
    habit: Habit;
    selectedDate: string;
  }

  export interface HabitTrackerProps {
    habit: Habit;
  }