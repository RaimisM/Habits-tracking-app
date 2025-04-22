export interface Habit {
    id: number;
    name: string;
    stoppedDate?: string;
    completedDates?: string[];
    [key: string]: any;
  }
  
  export interface HabitItemProps {
    habit: Habit;
    selectedDate: string;
  }
  
  export interface HabitTrackerProps {
    habit: Habit;
  }