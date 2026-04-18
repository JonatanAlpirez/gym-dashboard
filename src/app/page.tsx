import { getSummary, getRecentWorkouts, getMonthlyStats, getVolumeByMuscleGroup, getPersonalRecords, getWeeklyFrequency } from '@/lib/queries';
import DashboardClient from './components/DashboardClient';

export default function Dashboard() {
  const summary = getSummary();
  const recentWorkouts = getRecentWorkouts(10);
  const monthlyStats = getMonthlyStats().reverse();
  const volumeByMuscle = getVolumeByMuscleGroup();
  const personalRecords = getPersonalRecords(10);
  const weeklyFreq = getWeeklyFrequency();

  const maxVolume = Math.max(...monthlyStats.map(m => m.volume), 1);
  const maxFreq = Math.max(...weeklyFreq.map(w => w.count), 1);

  return (
    <DashboardClient
      summary={summary}
      recentWorkouts={recentWorkouts}
      monthlyStats={monthlyStats}
      volumeByMuscle={volumeByMuscle}
      personalRecords={personalRecords}
      weeklyFreq={weeklyFreq}
      maxVolume={maxVolume}
      maxFreq={maxFreq}
    />
  );
}
