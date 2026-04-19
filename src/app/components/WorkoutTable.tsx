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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 dark:text-[#9ca3af] text-sm border-b border-gray-200 dark:border-[#2a2a2a]">
            <th className="pb-3 font-medium">Fecha</th>
            <th className="pb-3 font-medium">Nombre</th>
            <th className="pb-3 font-medium hidden md:table-cell">Duración</th>
            <th className="pb-3 font-medium hidden lg:table-cell">Ejercicios</th>
            <th className="pb-3 font-medium hidden lg:table-cell">Sets</th>
            <th className="pb-3 font-medium text-right">Volumen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
          {workouts.map((workout) => (
            <tr
              key={workout.id}
              className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f] cursor-pointer transition-colors"
              onClick={() => onWorkoutClick(workout.id)}
            >
              <td className="py-3 text-sm text-gray-900 dark:text-[#e5e7eb]">{formatDate(workout.date)}</td>
              <td className="py-3 font-medium text-gray-900 dark:text-[#e5e7eb]">{workout.name}</td>
              <td className="py-3 text-sm text-gray-600 dark:text-[#9ca3af] hidden md:table-cell">
                {formatDuration(workout.duration_sec)}
              </td>
              <td className="py-3 text-sm text-gray-600 dark:text-[#9ca3af] hidden lg:table-cell">
                {workout.num_exercises}
              </td>
              <td className="py-3 text-sm text-gray-600 dark:text-[#9ca3af] hidden lg:table-cell">
                {workout.num_sets}
              </td>
              <td className="py-3 text-sm text-right font-medium text-gray-900 dark:text-[#e5e7eb]">
                {formatVolume(workout.total_volume)} lb
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
