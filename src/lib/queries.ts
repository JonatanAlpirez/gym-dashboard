import { getDb, Workout, WorkoutWithStats, MonthlyStats, ExerciseProgress, PersonalRecord, WorkoutDetail } from './types';

export function getSummary() {
  const db = getDb();
  
  const stats = db.prepare(`
    SELECT 
      COUNT(DISTINCT w.id) as total_workouts,
      COUNT(DISTINCT we.exercise_id) as total_exercises,
      COUNT(s.id) as total_sets,
      COALESCE(SUM(s.weight_lb * s.reps), 0) as total_volume,
      COALESCE(AVG(w.duration_sec), 0) as avg_duration
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we.workout_id
    LEFT JOIN sets s ON we.id = s.workout_exercise_id
  `).get() as any;

  return {
    totalWorkouts: stats.total_workouts || 0,
    totalExercises: stats.total_exercises || 0,
    totalSets: stats.total_sets || 0,
    totalVolume: Math.round(stats.total_volume || 0),
    avgDuration: Math.round((stats.avg_duration || 0) / 60)
  };
}

export function getRecentWorkouts(limit = 10): WorkoutWithStats[] {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      w.id,
      w.workout_num,
      w.date,
      w.name,
      w.duration_sec,
      COUNT(DISTINCT we.id) as num_exercises,
      COUNT(s.id) as num_sets,
      COALESCE(SUM(s.weight_lb * s.reps), 0) as total_volume
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we.workout_id
    LEFT JOIN sets s ON we.id = s.workout_exercise_id
    GROUP BY w.id
    ORDER BY w.date DESC
    LIMIT ?
  `).all(limit) as WorkoutWithStats[];
}

export function getMonthlyStats(): MonthlyStats[] {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      strftime('%Y-%m', w.date) as month,
      COUNT(DISTINCT w.id) as workouts,
      COALESCE(SUM(s.weight_lb * s.reps), 0) as volume
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we.workout_id
    LEFT JOIN sets s ON we.id = s.workout_exercise_id
    GROUP BY month
    ORDER BY month DESC
    LIMIT 12
  `).all() as MonthlyStats[];
}

export function getVolumeByMuscleGroup() {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      e.muscle_group,
      COALESCE(SUM(s.weight_lb * s.reps), 0) as volume
    FROM exercises e
    LEFT JOIN workout_exercises we ON e.id = we.exercise_id
    LEFT JOIN sets s ON we.id = s.workout_exercise_id
    GROUP BY e.muscle_group
    ORDER BY volume DESC
  `).all() as { muscle_group: string; volume: number }[];
}

export function getPersonalRecords(limit = 10): PersonalRecord[] {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      e.name,
      e.muscle_group,
      s.weight_lb as max_weight,
      s.reps,
      w.date
    FROM exercises e
    JOIN workout_exercises we ON e.id = we.exercise_id
    JOIN sets s ON we.id = s.workout_exercise_id
    JOIN workouts w ON we.workout_id = w.id
    WHERE s.weight_lb = (
      SELECT MAX(s2.weight_lb) 
      FROM sets s2 
      JOIN workout_exercises we2 ON s2.workout_exercise_id = we2.id 
      WHERE we2.exercise_id = e.id
    )
    ORDER BY s.weight_lb DESC
    LIMIT ?
  `).all(limit) as PersonalRecord[];
}

export function getExerciseProgress(exerciseName: string): ExerciseProgress[] {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      DATE(w.date) as date,
      MAX(s.weight_lb) as max_weight,
      MAX(ROUND(s.weight_lb * (1 + s.reps / 30.0), 1)) as max_1rm,
      COUNT(s.id) as sets
    FROM exercises e
    JOIN workout_exercises we ON e.id = we.exercise_id
    JOIN sets s ON we.id = s.workout_exercise_id
    JOIN workouts w ON we.workout_id = w.id
    WHERE e.name = ?
    GROUP BY DATE(w.date)
    ORDER BY date ASC
  `).all(exerciseName) as ExerciseProgress[];
}

export function getWorkoutDetail(date: string): WorkoutDetail | null {
  const db = getDb();
  
  const workout = db.prepare(`
    SELECT date, name, duration_sec
    FROM workouts
    WHERE DATE(date) = ?
  `).get(date) as any;

  if (!workout) return null;

  const exercises = db.prepare(`
    SELECT DISTINCT e.name, e.muscle_group
    FROM workout_exercises we
    JOIN exercises e ON we.exercise_id = e.id
    JOIN workouts w ON we.workout_id = w.id
    WHERE DATE(w.date) = ?
    ORDER BY we.exercise_order
  `).all(date) as { name: string; muscle_group: string }[];

  const result: WorkoutDetail = {
    date: workout.date,
    name: workout.name,
    duration_sec: workout.duration_sec,
    exercises: []
  };

  for (const ex of exercises) {
    const sets = db.prepare(`
      SELECT s.set_order, s.weight_lb, s.reps
      FROM sets s
      JOIN workout_exercises we ON s.workout_exercise_id = we.id
      JOIN workouts w ON we.workout_id = w.id
      WHERE DATE(w.date) = ? AND e.name = ?
      ORDER BY s.set_order
    `).all(date, ex.name) as any[];

    result.exercises.push({
      name: ex.name,
      muscle_group: ex.muscle_group,
      sets
    });
  }

  return result;
}

export function getAllExercises() {
  const db = getDb();
  return db.prepare(`
    SELECT DISTINCT name, muscle_group 
    FROM exercises 
    ORDER BY muscle_group, name
  `).all() as { name: string; muscle_group: string }[];
}

export function getWeeklyFrequency() {
  const db = getDb();
  
  return db.prepare(`
    SELECT 
      CASE CAST(strftime('%w', date) AS INTEGER)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
      END as day_name,
      COUNT(DISTINCT id) as count
    FROM workouts
    GROUP BY strftime('%w', date)
    ORDER BY strftime('%w', date)
  `).all() as { day_name: string; count: number }[];
}

export function getWorkoutById(id: number): WorkoutDetail | null {
  const db = getDb();
  
  const workout = db.prepare(`
    SELECT id, date, name, duration_sec
    FROM workouts
    WHERE id = ?
  `).get(id) as any;

  if (!workout) return null;

  const exercises = db.prepare(`
    SELECT DISTINCT e.name, e.muscle_group
    FROM workout_exercises we
    JOIN exercises e ON we.exercise_id = e.id
    WHERE we.workout_id = ?
    ORDER BY we.exercise_order
  `).all(id) as { name: string; muscle_group: string }[];

  const result: WorkoutDetail = {
    date: workout.date,
    name: workout.name,
    duration_sec: workout.duration_sec,
    exercises: []
  };


  for (const ex of exercises) {
    const sets = db.prepare(`
      SELECT s.set_order, s.weight_lb, s.reps
      FROM sets s
      WHERE s.workout_exercise_id IN (
        SELECT id FROM workout_exercises WHERE workout_id = ? AND exercise_id = (
          SELECT id FROM exercises WHERE name = ?
        )
      )
      ORDER BY s.set_order
    `).all(id, ex.name) as any[];

    result.exercises.push({
      name: ex.name,
      muscle_group: ex.muscle_group,
      sets
    });
  }

  return result;
}
