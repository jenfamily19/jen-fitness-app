import { useStore } from '../../store';
import { Utensils, Plus, X } from 'lucide-react';

export default function NutritionMatrix() {
  const meals = useStore(state => state.meals);
  const updateMeal = useStore(state => state.updateMeal);
  const deleteMeal = useStore(state => state.deleteMeal);
  const addMeal = useStore(state => state.addMeal);

  const handleAdd = () => {
    addMeal({ time: "12:00 PM", name: "Custom Added Meal", desc: "Description here..." });
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
            <Utensils size={20} /> Nutrition Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Target Metrics: ~2,300 kcal | 200g Protein | 220g Carbs | 70g Fat</p>
        </div>
        <button onClick={handleAdd} className="sm:self-center flex items-center gap-1 text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-lg font-medium transition-colors">
          <Plus size={14} /> Add Meal Slot
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map(meal => (
          <div key={meal.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between gap-3">
            <div>
              <div className="flex justify-between items-start">
                <input 
                  value={meal.time}
                  onChange={(e) => updateMeal(meal.id, { time: e.target.value })}
                  className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded-md w-24 outline-none"
                />
                <button onClick={() => deleteMeal(meal.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <input 
                type="text" 
                value={meal.name} 
                onChange={(e) => updateMeal(meal.id, { name: e.target.value })}
                className="bg-transparent font-medium text-sm text-slate-200 mt-2 border-none p-0 focus:ring-0 outline-none w-full"
              />
              <textarea 
                value={meal.desc}
                onChange={(e) => updateMeal(meal.id, { desc: e.target.value })}
                className="bg-transparent text-xs text-slate-400 mt-1.5 border-none p-0 focus:ring-0 outline-none w-full h-16 resize-none custom-scrollbar"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
