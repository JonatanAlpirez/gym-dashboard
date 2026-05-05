import { MonthlyStats } from '@/lib/types';
import styles from './MonthlyVolume.module.css';

function formatVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
  return volume.toString();
}

export default function MonthlyVolume({
  monthlyStats,
  maxVolume,
}: {
  monthlyStats: MonthlyStats[];
  maxVolume: number;
}) {
  return (
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
  );
}
