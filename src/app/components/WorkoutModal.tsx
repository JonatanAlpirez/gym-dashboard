'use client';

import { WorkoutDetail } from '@/lib/types';

function muscleGroupColor(muscle: string) {
  return `muscle-${muscle}`;
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{workout.name}</h2>
            <p className="modal-subtitle">{formatDate(workout.date)} — {formatDuration(workout.duration_sec)}</p>
          </div>
          <button
            onClick={onClose}
            className="modal-close"
          >
            ×
          </button>
        </div>

        {/* Exercises */}
        <div className="modal-body">
          {workout.exercises.map((exercise, i) => (
            <div key={i} className="exercise-item">
              <div className="exercise-header">
                <h3 className="exercise-name">{exercise.name}</h3>
                <span className={`muscle-badge ${muscleGroupColor(exercise.muscle_group)}`}>
                  {exercise.muscle_group}
                </span>
              </div>

              {/* Sets Table */}
              <div className="table-container">
                <table className="sets-table">
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
                        <td className="workout-volume">{set.weight_lb} lb</td>
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
