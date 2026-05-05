import { PersonalRecord } from '@/lib/types';
import styles from './PersonalRecords.module.css';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export default function PersonalRecords({
  personalRecords,
}: {
  personalRecords: PersonalRecord[];
}) {
  return (
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
  );
}
