'use client';

import { WorkoutWithStats } from '@/lib/types';

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
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th className="hidden-md">Duración</th>
            <th className="hidden-lg">Ejercicios</th>
            <th className="hidden-lg">Sets</th>
            <th className="text-right">Volumen</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr
              key={workout.id}
              onClick={() => onWorkoutClick(workout.id)}
            >
              <td>{formatDate(workout.date)}</td>
              <td className="workout-name">{workout.name}</td>
              <td className="hidden-md">{formatDuration(workout.duration_sec)}</td>
              <td className="hidden-lg">{workout.num_exercises}</td>
              <td className="hidden-lg">{workout.num_sets}</td>
              <td className="workout-volume">{formatVolume(workout.total_volume)} lb</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
