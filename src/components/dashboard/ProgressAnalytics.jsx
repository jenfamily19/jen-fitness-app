import { useStore } from '../../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ProgressAnalytics() {
  const history = useStore(state => state.history);
  const telemetry = useStore(state => state.telemetry);
  const currentWeek = useStore(state => state.currentWeek);

  const data = history.map(entry => ({
    name: `Week ${entry.week}`,
    energy: entry.telemetry.energy,
    sleep: entry.telemetry.sleep,
  }));

  data.push({
    name: `Week ${currentWeek}`,
    energy: telemetry.energy,
    sleep: telemetry.sleep,
  });

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-pink-400 mb-6 flex items-center gap-2">
        <TrendingUp size={20} /> Telemetry Trends
      </h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ color: '#f1f5f9' }}
            />
            <Line type="monotone" dataKey="energy" name="Energy" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4, fill: '#60a5fa' }} />
            <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#c084fc" strokeWidth={3} dot={{ r: 4, fill: '#c084fc' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
