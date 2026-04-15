import { getSummary, getRecentWorkouts, getMonthlyStats, getVolumeByMuscleGroup, getPersonalRecords, getWeeklyFrequency } from '@/lib/queries';

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
          <StatCard 
            title="Workouts" 
            value={summary.totalWorkouts} 
            icon="🏋️"
          />
          <StatCard 
            title="Ejercicios" 
            value={summary.totalExercises} 
            icon="💪"
          />
          <StatCard 
            title="Sets Totales" 
            value={summary.totalSets} 
            icon="📊"
          />
          <StatCard 
            title="Duración Prom." 
            value={`${summary.avgDuration} min`} 
            icon="⏱️"
          />
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
                        backgroundColor: muscleGroupColor(mg.muscle_group).split(' ')[0].replace('bg-', '#').replace('-100', '')
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Fecha</th>
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Duración</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Ejercicios</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Sets</th>
                  <th className="pb-3 font-medium text-right">Volumen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentWorkouts.map((workout) => (
                  <tr key={workout.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm">{formatDate(workout.date)}</td>
                    <td className="py-3 font-medium">{workout.name}</td>
                    <td className="py-3 text-sm text-gray-600 hidden md:table-cell">
                      {formatDuration(workout.duration_sec)}
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {workout.num_exercises}
                    </td>
                    <td className="py-3 text-sm text-gray-600 hidden lg:table-cell">
                      {workout.num_sets}
                    </td>
                    <td className="py-3 text-sm text-right font-medium">
                      {formatVolume(workout.total_volume)} lb
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
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
