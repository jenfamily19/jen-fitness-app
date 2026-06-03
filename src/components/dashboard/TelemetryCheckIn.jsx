import { useStore } from '../../store';
import { BarChart2 } from 'lucide-react';

export default function TelemetryCheckIn() {
  const telemetry = useStore(state => state.telemetry);
  const updateTelemetry = useStore(state => state.updateTelemetry);
  
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-blue-400 flex items-center gap-2">
        <BarChart2 size={20} /> Telemetry Check-In
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Energy (1-10)</label>
          <input 
            type="number" 
            value={telemetry.energy} 
            onChange={(e) => updateTelemetry({ energy: Number(e.target.value) })}
            min="1" max="10" 
            className="w-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white text-center focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Sleep (1-10)</label>
          <input 
            type="number" 
            value={telemetry.sleep} 
            onChange={(e) => updateTelemetry({ sleep: Number(e.target.value) })}
            min="1" max="10" 
            className="w-full mt-1.5 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white text-center focus:border-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
