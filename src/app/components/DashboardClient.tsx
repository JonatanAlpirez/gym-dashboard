'use client';

import { useState } from 'react';
import { WorkoutDetail, WorkoutWithStats, MonthlyStats, PersonalRecord } from '@/lib/types';
import WorkoutModal from './WorkoutModal';
import WorkoutTable from './WorkoutTable';
import { useTheme } from './ThemeContext';

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
    Chest: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    Back: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    Shoulders: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
    Legs: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    Arms: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    Core: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  };
  return colors[muscle] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
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
  const { theme, toggleTheme } = useTheme();

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
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-white dark:bg-[#111111] shadow-sm border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-[#e5e7eb]">💪 Gym Tracker Dashboard</h1>
            <p className="text-gray-500 dark:text-[#9ca3af] mt-1">Datos de Strong App — {summary.totalWorkouts} entrenamientos</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>
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
          <section className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">📈 Volumen Mensual</h2>
            <div className="space-y-2">
              {monthlyStats.map((month) => (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-[#9ca3af] w-16">{month.month}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full h-6 overflow-hidden">
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
          <section className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">📅 Frecuencia Semanal</h2>
            <div className="flex items-end justify-around gap-2 h-40">
              {weeklyFreq.map((day) => (
                <div key={day.day_name} className="flex flex-col items-center gap-2">
                  <div className="w-12 bg-blue-100 dark:bg-blue-900/30 rounded-t-lg flex items-end justify-center overflow-hidden" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-blue-500 rounded-t-lg transition-all"
                      style={{ height: `${(day.count / maxFreq) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-[#9ca3af]">{day.day_name.slice(0, 3)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-[#e5e7eb]">{day.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Volumen por Grupo Muscular */}
          <section className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">🎯 Volumen por Grupo</h2>
            <div className="space-y-3">
              {volumeByMuscle.map((mg) => (
                <div key={mg.muscle_group} className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${muscleGroupColor(mg.muscle_group)}`}>
                    {mg.muscle_group}
                  </span>
                  <div className="flex-1 bg-gray-100 dark:bg-[#2a2a2a] rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(mg.volume / (volumeByMuscle[0]?.volume || 1)) * 100}%`,
                        backgroundColor: '#3b82f6'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-[#9ca3af] w-16 text-right">
                    {formatVolume(mg.volume)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Récords Personales */}
          <section className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">🏆 Top 10 Récords</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {personalRecords.map((pr, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-[#1f1f1f] rounded">
                  <span className="text-2xl">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-[#e5e7eb]">{pr.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#9ca3af]">{formatDate(pr.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900 dark:text-[#e5e7eb]">{pr.max_weight} lb</p>
                    <p className="text-xs text-gray-500 dark:text-[#9ca3af]">{pr.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Últimos Workouts */}
        <section className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#e5e7eb]">📋 Últimos Entrenamientos</h2>
          <p className="text-sm text-gray-500 dark:text-[#9ca3af] mb-4">Haz clic en cualquier workout para ver los detalles</p>
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
          <div className="bg-white dark:bg-[#111111] rounded-xl p-8">
            <p className="text-lg text-gray-900 dark:text-[#e5e7eb]">Cargando...</p>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-200 dark:border-[#2a2a2a] p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500 dark:text-[#9ca3af]">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-[#e5e7eb]">{value}</p>
        </div>
      </div>
    </div>
  );
}
