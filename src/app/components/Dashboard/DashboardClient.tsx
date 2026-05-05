'use client';

import { WorkoutWithStats, MonthlyStats, PersonalRecord } from '@/lib/types';
import WorkoutTable from '../WorkoutTable/WorkoutTable';
import { useTheme } from '../ThemeContext/ThemeContext';
import styles from './DashboardClient.module.css';
import StatsGrid from '../StatsGrid/StatsGrid';
import MonthlyVolume from '../MonthlyVolume/MonthlyVolume';
import WeeklyFrequency from '../WeeklyFrequency/WeeklyFrequency';
import VolumeByMuscle from '../VolumeByMuscle/VolumeByMuscle';
import PersonalRecords from '../PersonalRecords/PersonalRecords';

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
  const { theme, toggleTheme } = useTheme();

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
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#334155' }}>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className={styles.main}>
        {/* Stats Cards */}
        <StatsGrid summary={summary} />

        {/* Últimos Workouts */}
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>📋 Últimos Entrenamientos</h2>
          <p className={styles.tableNote}>Haz clic en cualquier workout para ver los detalles</p>
          <WorkoutTable workouts={recentWorkouts} />
        </section>

        <div className={styles.twoColGrid}>
          {/* Progreso Mensual */}
          <MonthlyVolume monthlyStats={monthlyStats} maxVolume={maxVolume} />

          {/* Frecuencia Semanal */}
          <WeeklyFrequency weeklyFreq={weeklyFreq} maxFreq={maxFreq} />

          {/* Volumen por Grupo Muscular */}
          <VolumeByMuscle volumeByMuscle={volumeByMuscle} />

          {/* Récords Personales */}
          <PersonalRecords personalRecords={personalRecords} />
        </div>


      </div>


    </main>
  );
}
