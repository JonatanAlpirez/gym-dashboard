import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), '..', '..', 'gym_training', 'DB', 'gym_tracker.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export interface Workout {
  id: number;
  workout_num: number;
  date: string;
  name: string;
  duration_sec: number;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

export interface WorkoutWithStats extends Workout {
  num_exercises: number;
  num_sets: number;
  total_volume: number;
}

export interface MonthlyStats {
  month: string;
  workouts: number;
  volume: number;
}

export interface ExerciseProgress {
  date: string;
  max_weight: number;
  max_1rm: number;
  sets: number;
}

export interface PersonalRecord {
  name: string;
  max_weight: number;
  reps: number;
  date: string;
  muscle_group: string;
}

export interface WorkoutDetail {
  date: string;
  name: string;
  duration_sec: number;
  exercises: {
    name: string;
    muscle_group: string;
    sets: {
      set_order: number;
      weight_lb: number;
      reps: number;
    }[];
  }[];
}
