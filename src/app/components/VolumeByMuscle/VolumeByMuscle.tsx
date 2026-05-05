import styles from './VolumeByMuscle.module.css';

function formatVolume(volume: number) {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
  return volume.toString();
}

export default function VolumeByMuscle({
  volumeByMuscle,
}: {
  volumeByMuscle: { muscle_group: string; volume: number }[];
}) {
  return (
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
  );
}
