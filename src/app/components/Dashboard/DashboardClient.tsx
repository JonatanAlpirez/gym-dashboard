'use client';

import { useState } from 'react';
import { WorkoutDetail, WorkoutWithStats, MonthlyStats, PersonalRecord } from '@/lib/types';
import WorkoutModal from '../WorkoutModal/WorkoutModal';
import WorkoutTable from '../WorkoutTable/WorkoutTable';
import { useTheme } from '../ThemeContext/ThemeContext';
import styles from './DashboardClient.module.css';

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

export default function DashboardClient({
  recentWorkouts,
  monthlyStats,
  volumeByMuscle,
  personalRecords,
  weeklyFreq,
  maxVolume,
  maxFreq,
  summary,
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
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1>Gym Tracker Dashboard</h1>
            <p>Datos de Strong App — {summary.totalWorkouts} entrenamientos</p>
          </div>
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

      <div className={styles.main}>
        {/* Stats Cards */}
        <section className={styles.statsGrid}>
          <StatCard title="Workouts" value={summary.totalWorkouts} icon="🏋️" />
          <StatCard title="Ejercicios" value={summary.totalExercises} icon="💪" />
          <StatCard title="Sets Totales" value={summary.totalSets} icon="📊" />
          <StatCard title="Duración Prom." value={`${summary.avgDuration} min`} icon="⏱️" />
        </section>

        <div className={styles.twoColGrid}>
          {/* Progreso Mensual */}
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>📈 Volumen Mensual</h2>
            <div className={styles.volumeList}>
              {monthlyStats.map((month) => (
                <div key={month.month} className={styles.volumeItem}>
                  <span className={styles.volumeLabel}>{month.month}</span>
                  <div className={styles.volumeBarContainer}>
                    <div
                      className={styles.volumeBar}
                      style={{ width: `${(month.volume / maxVolume) * 100}%` }}
                    >
                      <span className={styles.volumeBarText}>{formatVolume(month.volume)} lb</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Frecuencia Semanal */}
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>📅 Frecuencia Semanal</h2>
            <div className={styles.weeklyChart}>
              {weeklyFreq.map((day) => (
                <div key={day.day_name} className={styles.weeklyItem}>
                  <div className={styles.weeklyBarContainer} style={{ height: '120px' }}>
                    <div
                      className={styles.weeklyBar}
                      style={{ height: `${(day.count / maxFreq) * 100}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    />
                  </div>
                  <span className={styles.weeklyDay}>{day.day_name.slice(0, 3)}</span>
                  <span className={styles.weeklyCount}>{day.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Volumen por Grupo Muscular */}
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>🎯 Volumen por Grupo</h2>
            <div className={styles.volumeList}>
              {volumeByMuscle.map((mg) => (
                <div key={mg.muscle_group} className={styles.volumeItem}>
                  <span className={`${styles.muscleBadge} ${styles[`muscle${mg.muscle_group}` as keyof typeof styles]}`}>
                    {mg.muscle_group}
                  </span>
                  <div className={styles.volumeBarContainer}>
                    <div
                      className={styles.volumeBar}
                      style={{ width: `${(mg.volume / (volumeByMuscle[0]?.volume || 1)) * 100}%` }}
                    />
                  </div>
                  <span className={styles.volumeValue}>{formatVolume(mg.volume)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Récords Personales */}
          <section className={styles.sectionCard}>
            <h2 className={styles.sectionTitle}>🏆 Top 10 Récords</h2>
            <div className={styles.prList}>
              {personalRecords.map((pr, i) => (
                <div key={i} className={styles.prItem}>
                  <span className={styles.prEmoji}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <div className={styles.prInfo}>
                    <p className={styles.prName}>{pr.name}</p>
                    <p className={styles.prDate}>{formatDate(pr.date)}</p>
                  </div>
                  <div className={styles.prStats}>
                    <p className={styles.prWeight}>{pr.max_weight} lb</p>
                    <p className={styles.prReps}>{pr.reps} reps</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Últimos Workouts */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>📋 Últimos Entrenamientos</h2>
          <p className={styles.tableNote}>Haz clic en cualquier workout para ver los detalles</p>
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
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBox}>
            <p className={styles.loadingText}>Cargando...</p>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <div>
        <p className={styles.statTitle}>{title}</p>
        <p className={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}
