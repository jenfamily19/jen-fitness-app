import { useState } from 'react';
import { useStore } from '../../store';
import { Dumbbell, Plus, X, CheckCircle2, Circle, Info, CheckSquare } from 'lucide-react';

export default function TrainingTab() {
  const workouts = useStore(state => state.workouts);
  const updateExercise = useStore(state => state.updateExercise);
  const deleteExercise = useStore(state => state.deleteExercise);
  const addExercise = useStore(state => state.addExercise);
  
  const [selectedDayId, setSelectedDayId] = useState(workouts[0]?.dayId || "");
  
  const targetBlock = workouts.find(w => w.dayId === selectedDayId);
  
  const completedCount = targetBlock ? targetBlock.exercises.filter(ex => ex.isCompleted).length : 0;
  const totalCount = targetBlock ? targetBlock.exercises.length : 0;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const isDayComplete = totalCount > 0 && completedCount === totalCount;

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

  const markAllComplete = () => {
    if (!targetBlock) return;
    targetBlock.exercises.forEach(ex => {
      updateExercise(selectedDayId, ex.id, { isCompleted: true });
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 md:p-6 mb-20">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Dumbbell size={20} className="text-emerald-500" /> Training Split
          </h2>
          <p className="text-xs text-gray-500 mt-1">Select your training day below to begin tracking.</p>
        </div>
        <div className="w-full sm:w-auto">
          <select 
            value={selectedDayId}
            onChange={(e) => setSelectedDayId(e.target.value)}
            className="w-full bg-white shadow-sm border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {workouts.map(w => (
              <option key={w.dayId} value={w.dayId}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Progress Bar & Mark All Complete */}
      {targetBlock && totalCount > 0 && (
        <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Day Progress</span>
              <span className={`text-sm font-bold ${isDayComplete ? 'text-emerald-600' : 'text-gray-500'}`}>
                {progressPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          <button 
            onClick={markAllComplete}
            disabled={isDayComplete}
            className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm ${
              isDayComplete 
                ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-not-allowed'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700'
            }`}
          >
            <CheckSquare size={16} /> {isDayComplete ? "Day Completed" : "Complete Entire Day"}
          </button>
        </div>
      )}

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {!targetBlock || totalCount === 0 ? (
          <div className="col-span-full py-10 text-center text-gray-500 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No exercise data mapped to this session profile.
          </div>
        ) : (
          targetBlock.exercises.map((ex) => {
            const isDone = ex.isCompleted;
            return (
              <div key={ex.id} className={`relative flex flex-col p-4 rounded-xl border transition-all duration-300 shadow-sm ${
                isDone 
                  ? 'bg-gray-50 border-emerald-200 opacity-80' 
                  : 'bg-white border-gray-200 hover:shadow-md hover:border-emerald-300'
                }`}
              >
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex-1">
                    <input 
                      value={ex.name} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { name: e.target.value })}
                      className={`font-bold text-base bg-transparent border-none p-0 outline-none w-full ${isDone ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-gray-900'}`}
                    />
                  </div>
                  <button onClick={() => deleteExercise(selectedDayId, ex.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-gray-50 hover:bg-red-50 rounded-md">
                    <X size={16} />
                  </button>
                </div>

                {/* Smart Tip Box */}
                {ex.tip && (
                  <div className="mb-4 p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-lg flex items-start gap-2">
                    <Info size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-emerald-900 leading-relaxed font-medium">{ex.tip}</span>
                  </div>
                )}

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="flex flex-col bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Sets x Reps</span>
                    <div className="flex items-center justify-center">
                      <input 
                        type="number"
                        value={ex.sets} 
                        onChange={(e) => updateExercise(selectedDayId, ex.id, { sets: Number(e.target.value) })}
                        className="w-6 bg-transparent text-center text-sm font-bold text-gray-900 outline-none"
                      /> 
                      <span className="text-gray-400 text-xs mx-1">x</span>
                      <input 
                        value={ex.target} 
                        onChange={(e) => updateExercise(selectedDayId, ex.id, { target: e.target.value })}
                        className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold text-center">Weight (kg)</span>
                    <input 
                      type="number" 
                      value={ex.weight} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { weight: Number(e.target.value) })}
                      className="w-full bg-transparent text-center text-sm text-teal-600 font-black outline-none"
                    />
                  </div>

                  <div className="flex flex-col bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold text-center">RPE</span>
                    <input 
                      type="number" step="0.5" min="1" max="10" 
                      value={ex.rpe} 
                      onChange={(e) => updateExercise(selectedDayId, ex.id, { rpe: Number(e.target.value) })}
                      className="w-full bg-transparent text-center text-sm text-rose-500 font-black outline-none"
                    />
                  </div>
                </div>

                {/* Notes Row */}
                <div className="mb-4">
                  <textarea 
                    value={ex.notes || ""} 
                    onChange={(e) => updateExercise(selectedDayId, ex.id, { notes: e.target.value })}
                    placeholder="Add performance notes or adjustments..."
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 text-xs font-medium text-gray-700 outline-none h-12 resize-none custom-scrollbar focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Completion Toggle */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => updateExercise(selectedDayId, ex.id, { isCompleted: !isDone })}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                      isDone 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm'
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
      
      <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
        <button onClick={handleAdd} className="flex items-center gap-2 text-xs bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-bold shadow-sm transition-colors">
          <Plus size={16} /> Add Custom Exercise
        </button>
      </div>
    </div>
  );
}
