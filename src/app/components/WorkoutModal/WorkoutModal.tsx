'use client';

import { WorkoutDetail } from '@/lib/types';
import styles from './WorkoutModal.module.css';

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

export default function WorkoutModal({ workout, onClose }: { workout: WorkoutDetail; onClose: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{workout.name}</h2>
            <p className={styles.modalSubtitle}>{formatDate(workout.date)} — {formatDuration(workout.duration_sec)}</p>
          </div>
          <button
            onClick={onClose}
            className={styles.modalClose}
          >
            ×
          </button>
        </div>

        {/* Exercises */}
        <div className={styles.modalBody}>
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
    </div>
  );
}
