'use client';

import { useState, useEffect } from 'react';
import { WorkoutDetail } from '@/lib/types';

function muscleGroupColor(muscle: string) {
  const colors: Record<string, string> = {
    Chest: 'bg-red-100 text-red-800',
    Back: 'bg-blue-100 text-blue-800',
    Shoulders: 'bg-yellow-100 text-yellow-800',
    Legs: 'bg-green-100 text-green-800',
    Arms: 'bg-purple-100 text-purple-800',
    Core: 'bg-orange-100 text-orange-800',
  };
  return colors[muscle] || 'bg-gray-100 text-gray-800';
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
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
            <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${muscleGroupColor(exercise.muscle_group)}`}>
                  {exercise.muscle_group}
                </span>
              </div>
              
              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">Set</th>
                      <th className="pb-2 font-medium">Peso</th>
                      <th className="pb-2 font-medium">Reps</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {exercise.sets.map((set, j) => (
                      <tr key={j} className="hover:bg-gray-50">
                        <td className="py-2 text-gray-600">{set.set_order}</td>
                        <td className="py-2 font-medium">{set.weight_lb} lb</td>
                        <td className="py-2">{set.reps}</td>
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
