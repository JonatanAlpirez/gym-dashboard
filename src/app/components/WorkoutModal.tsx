'use client';

import { WorkoutDetail } from '@/lib/types';

function muscleGroupColor(muscle: string) {
  const colors: Record<string, string> = {
    Chest: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    Back: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Shoulders: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    Legs: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Arms: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    Core: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  };
  return colors[muscle] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#111111] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{workout.name}</h2>
              <p className="text-blue-100 mt-1">{formatDate(workout.date)} — {formatDuration(workout.duration_sec)}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Exercises */}
        <div className="p-6 space-y-6">
          {workout.exercises.map((exercise, i) => (
            <div key={i} className="border-b border-gray-100 dark:border-[#2a2a2a] pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-[#e5e7eb]">{exercise.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${muscleGroupColor(exercise.muscle_group)}`}>
                  {exercise.muscle_group}
                </span>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-[#9ca3af] border-b border-gray-100 dark:border-[#2a2a2a]">
                      <th className="pb-2 font-medium">Set</th>
                      <th className="pb-2 font-medium">Peso</th>
                      <th className="pb-2 font-medium">Reps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                    {exercise.sets.map((set, j) => (
                      <tr key={j} className="hover:bg-gray-50 dark:hover:bg-[#1f1f1f]">
                        <td className="py-2 text-gray-600 dark:text-[#9ca3af]">{set.set_order}</td>
                        <td className="py-2 font-medium text-gray-900 dark:text-[#e5e7eb]">{set.weight_lb} lb</td>
                        <td className="py-2 text-gray-900 dark:text-[#e5e7eb]">{set.reps}</td>
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
