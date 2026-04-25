'use client';

import { WorkoutWithStats } from '@/lib/types';
import styles from './WorkoutTable.module.css';

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

function formatVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
  return volume.toString();
}

export default function WorkoutTable({ workouts, onWorkoutClick }: {
  workouts: WorkoutWithStats[];
  onWorkoutClick: (id: number) => void;
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th className={styles.hiddenMd}>Duración</th>
            <th className={styles.hiddenLg}>Ejercicios</th>
            <th className={styles.hiddenLg}>Sets</th>
            <th className={styles.textRight}>Volumen</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr
              key={workout.id}
              onClick={() => onWorkoutClick(workout.id)}
            >
              <td>{formatDate(workout.date)}</td>
              <td className={styles.workoutName}>{workout.name}</td>
              <td className={styles.hiddenMd}>{formatDuration(workout.duration_sec)}</td>
              <td className={styles.hiddenLg}>{workout.num_exercises}</td>
              <td className={styles.hiddenLg}>{workout.num_sets}</td>
              <td className={styles.workoutVolume}>{formatVolume(workout.total_volume)} lb</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
