'use client';

import { useState } from 'react';
import { WorkoutDetail, WorkoutWithStats, MonthlyStats, PersonalRecord } from '@/lib/types';
import WorkoutModal from './WorkoutModal';
import WorkoutTable from './WorkoutTable';

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

export default function DashboardClient({
  summary,
  recentWorkouts,
  monthlyStats,
  volumeByMuscle,
  personalRecords,
  weeklyFreq,
  maxVolume,
  maxFreq,
}: {
  summary: { totalWorkouts: number; totalExercises: number; totalSets: number; avgDuration: number };
  recentWorkouts: WorkoutWithStats[];
  monthlyStats: MonthlyStats[];
  volumeByMuscle: { muscle_group: string; volume: number }[];
  personalRecords: PersonalRecord[];
  weeklyFreq: { day_name: string; count: number }[];
  maxVolume: number;
  maxFreq: number;
}) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const handleWorkoutClick = async (id: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workout?id=${id}`);
      const workout = await res.json();
      setSelectedWorkout(workout);
    } catch (error) {
      console.error('Error loading workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">💪 Gym Tracker Dashboard</h1>
          <p className="text-gray-500 mt-1">Datos de Strong App — {summary.totalWorkouts} entrenamientos</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Workouts" value={summary.totalWorkouts} icon="🏋️" />
          <StatCard title="Ejercicios" value={summary.totalExercises} icon="💪" />
          <StatCard title="Sets Totales" value={summary.totalSets} icon="📊" />
          <StatCard title="Duración Prom." value={`${summary.avgDuration} min`} icon="⏱️" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progreso Mensual */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Volumen Mensual</h2>
            <div className="space-y-2">
              {monthlyStats.map((month) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">{month.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(month.volume / maxVolume) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {formatVolume(month.volume)} lb
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Frecuencia Semanal */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Frecuencia Semanal</h2>
            <div className="flex items-end justify-around gap-2 h-40">
              {weeklyFreq.map((day) => (
                <div key={day.day_name} className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-blue-100 rounded-t-lg flex items-end justify-center overflow-hidden" style={{ height: '120px' }}>
                    <div 
                      className="w-full bg-blue-500 rounded-t-lg transition-all"
                      style={{ height: `${(day.count / maxFreq) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{day.day_name.slice(0, 3)}</span>
                  <span className="text-sm font-medium">{day.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Volumen por Grupo Muscular */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Volumen por Grupo</h2>
            <div className="space-y-3">
              {volumeByMuscle.map((mg) => (
                <div key={mg.muscle_group} className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${muscleGroupColor(mg.muscle_group)}`}>
                    {mg.muscle_group}
                  </span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${(mg.volume / (volumeByMuscle[0]?.volume || 1)) * 100}%`,
                        backgroundColor: '#3b82f6'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {formatVolume(mg.volume)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Récords Personales */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">🏆 Top 10 Récords</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {personalRecords.map((pr, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                  <span className="text-2xl">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{pr.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(pr.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{pr.max_weight} lb</p>
                    <p className="text-xs text-gray-500">{pr.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Últimos Workouts */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Últimos Entrenamientos</h2>
          <p className="text-sm text-gray-500 mb-4">Haz clic en cualquier workout para ver los detalles</p>
          <WorkoutTable workouts={recentWorkouts} onWorkoutClick={handleWorkoutClick} />
        </section>
      </div>

      {/* Workout Detail Modal */}
      {selectedWorkout && (
        <WorkoutModal 
          workout={selectedWorkout} 
          onClose={() => setSelectedWorkout(null)} 
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8">
            <p className="text-lg">Cargando...</p>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
