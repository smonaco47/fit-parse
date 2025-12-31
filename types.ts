
export interface WorkoutSet {
  date: string;
  exercise: string;
  weight: string | number;
  reps: number;
  set_number: number;
  notes: string;
}

export interface ProcessingState {
  isLoading: boolean;
  error: string | null;
  data: WorkoutSet[] | null;
}
