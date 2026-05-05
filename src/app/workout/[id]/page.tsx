'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkoutDetail } from '@/lib/types';
import { useTheme } from '@/app/components/ThemeContext/ThemeContext';
import styles from './workout.module.css';

function muscleGroupClass(muscle: string) {
  const map: Record<string, string> = {
    Chest: styles.muscleChest,
    Back: styles.muscleBack,
    Shoulders: styles.muscleShoulders,
    Legs: styles.muscleLegs,
    Arms: styles.muscleArms,
    Core: styles.muscleCore,
  };
  return map[muscle] || styles.muscleBadge;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatDuration(sec: number) {
  const min = Math.round(sec / 60);
  return `${min} min`;
}

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function load() {
      try {
        const id = params.id;
        const res = await fetch(`/api/workout?id=${id}`);
        if (!res.ok) throw new Error('Workout not found');
        const data = await res.json();
        setWorkout(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workout');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.loadingBox}>
          <p className={styles.loadingText}>Cargando...</p>
        </div>
      </main>
    );
  }

  if (error || !workout) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          <p className={styles.errorText}>{error || 'Workout not found'}</p>
          <button onClick={() => router.push('/')} className={styles.backButton}>
            ← Volver al Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={() => router.push('/')} className={styles.backButtonHeader}>
            ← Volver
          </button>
          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fbbf24' }}>
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#334155' }}>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Workout Header */}
        <div className={styles.workoutHeader}>
          <div>
            <h1 className={styles.workoutTitle}>{workout.name}</h1>
            <p className={styles.workoutSubtitle}>{formatDate(workout.date)} — {formatDuration(workout.duration_sec)}</p>
          </div>
        </div>

        {/* Exercises */}
        <div className={styles.exercisesList}>
          {workout.exercises.map((exercise, i) => (
            <div key={i} className={styles.exerciseItem}>
              <div className={styles.exerciseHeader}>
                <h3 className={styles.exerciseName}>{exercise.name}</h3>
                <span className={`${styles.muscleBadge} ${muscleGroupClass(exercise.muscle_group)}`}>
                  {exercise.muscle_group}
                </span>
              </div>

              {/* Sets Table */}
              <div className={styles.tableContainer}>
                <table className={styles.setsTable}>
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Peso</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, j) => (
                      <tr key={j}>
                        <td>{set.set_order}</td>
                        <td className={styles.workoutVolume}>{set.weight_lb} lb</td>
                        <td>{set.reps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}