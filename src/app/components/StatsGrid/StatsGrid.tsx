import styles from './StatsGrid.module.css';

export default function StatsGrid({
  summary,
}: {
  summary: { totalWorkouts: number; totalExercises: number; totalSets: number; avgDuration: number };
}) {
  return (
    <section className={styles.statsGrid}>
      <StatCard title="Workouts" value={summary.totalWorkouts} icon="🏋️" />
      <StatCard title="Ejercicios" value={summary.totalExercises} icon="💪" />
      <StatCard title="Sets Totales" value={summary.totalSets} icon="📊" />
      <StatCard title="Duración Prom." value={`${summary.avgDuration} min`} icon="⏱️" />
    </section>
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
