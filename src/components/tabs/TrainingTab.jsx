import { useState } from 'react';
import { useStore } from '../../store';
import { Dumbbell, Plus, X, CheckCircle2, Circle } from 'lucide-react';

export default function TrainingTab() {
  const workouts = useStore(state => state.workouts);
  const updateExercise = useStore(state => state.updateExercise);
  const deleteExercise = useStore(state => state.deleteExercise);
  const addExercise = useStore(state => state.addExercise);
  
  const [selectedDayId, setSelectedDayId] = useState(workouts[0]?.dayId || "");
  
  const targetBlock = workouts.find(w => w.dayId === selectedDayId);

  const handleAdd = () => {
    addExercise(selectedDayId, { 
      name: "Custom Exercise", 
      sets: 3, 
      target: "10-12 reps", 
      weight: 0, 
      rpe: 8, 
      tip: "Custom exercise tip.", 
      notes: "",
      isCompleted: false
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
            <Dumbbell size={20} /> Training Split
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Microcycle Focus: 6:30 AM Structural Adaptation & Joint Sparing</p>
        </div>
        <div className="w-full sm:w-auto">
          <select 
            value={selectedDayId}
            onChange={(e) => setSelectedDayId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-amber-500"
          >
            {workouts.map(w => (
              <option key={w.dayId} value={w.dayId}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {!targetBlock || targetBlock.exercises.length === 0 ? (
          <div className="col-span-full py-6 text-center text-slate-500 text-sm">No exercise data mapped to this session profile.</div>
        ) : (
          targetBlock.exercises.map((ex) => {
            const isDone = ex.isCompleted;
            return (
              <div key={ex.id} className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300 ${isDone ? 'bg-emerald-950/20 border-emerald-900/50 opacity-75' : 'bg-slate-900/50 border-slate-800'}`}>
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex-1">
                    <input 
                      value={ex.name} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { name: e.target.value })}
                      className={`font-semibold text-base bg-transparent border-none p-0 outline-none w-full ${isDone ? 'text-emerald-300' : 'text-slate-200'}`}
                    />
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{ex.tip}</div>
                  </div>
                  <button onClick={() => deleteExercise(selectedDayId, ex.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                    <X size={18} />
                  </button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="flex flex-col bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Sets & Reps</span>
                    <div className="flex items-center">
                      <input 
                        type="number"
                        value={ex.sets} 
                        onChange={(e) => updateExercise(selectedDayId, ex.id, { sets: Number(e.target.value) })}
                        className="w-8 bg-transparent text-center text-sm text-white outline-none"
                      /> 
                      <span className="text-slate-500 text-xs mx-1">x</span>
                      <input 
                        value={ex.target} 
                        onChange={(e) => updateExercise(selectedDayId, ex.id, { target: e.target.value })}
                        className="w-full bg-transparent text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">Weight (kg)</span>
                    <input 
                      type="number" 
                      value={ex.weight} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { weight: Number(e.target.value) })}
                      className="w-full bg-transparent text-center text-sm text-amber-400 font-bold outline-none"
                    />
                  </div>

                  <div className="flex flex-col bg-slate-950/50 rounded-lg p-2 border border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">RPE</span>
                    <input 
                      type="number" step="0.5" min="1" max="10" 
                      value={ex.rpe} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { rpe: Number(e.target.value) })}
                      className="w-full bg-transparent text-center text-sm text-rose-400 font-bold outline-none"
                    />
                  </div>
                </div>

                {/* Notes Row */}
                <div className="mb-4">
                  <textarea 
                    value={ex.notes || ""} 
                    onChange={(e) => updateExercise(selectedDayId, ex.id, { notes: e.target.value })}
                    placeholder="Add performance notes, form cues, or adjustments..."
                    className="w-full bg-slate-950/50 border border-slate-800/50 rounded-lg p-2.5 text-xs text-slate-300 outline-none h-14 resize-none custom-scrollbar focus:border-amber-500/50"
                  />
                </div>

                {/* Completion Toggle */}
                <div className="mt-auto pt-2 border-t border-slate-800/50">
                  <button 
                    onClick={() => updateExercise(selectedDayId, ex.id, { isCompleted: !isDone })}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                      isDone 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isDone ? (
                      <><CheckCircle2 size={18} /> Completed</>
                    ) : (
                      <><Circle size={18} /> Mark as Complete</>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
        <button onClick={handleAdd} className="flex items-center gap-1 text-xs bg-amber-950 hover:bg-amber-900 text-amber-400 border border-amber-800 px-4 py-2 rounded-lg font-bold transition-colors">
          <Plus size={16} /> Add Custom Exercise
        </button>
      </div>
    </div>
  );
}
