import styles from './WeeklyFrequency.module.css';

export default function WeeklyFrequency({
  weeklyFreq,
  maxFreq,
}: {
  weeklyFreq: { day_name: string; count: number }[];
  maxFreq: number;
}) {
  return (
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
  );
}
