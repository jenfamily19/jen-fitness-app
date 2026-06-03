import { useStore } from '../../store';
import { Clock, Pill, Utensils } from 'lucide-react';

export default function ScheduleTab() {
  const supplements = useStore(state => state.supplements);
  const meals = useStore(state => state.meals);

  const timelineMap = {};

  const addItem = (time, item) => {
    if (!timelineMap[time]) timelineMap[time] = [];
    timelineMap[time].push(item);
  };

  supplements.forEach(supp => {
    if (supp.scheduleTime) {
      addItem(supp.scheduleTime, {
        id: supp.id,
        type: 'supplement',
        title: supp.name,
        subtitle: `${supp.daily} ${supp.unit}`,
        desc: supp.time, 
      });
    }
  });

  meals.forEach(meal => {
    if (meal.scheduleTime) {
      addItem(meal.scheduleTime, {
        id: meal.id,
        type: 'meal',
        title: meal.name,
        subtitle: 'Meal Block',
        desc: meal.desc,
      });
    }
  });

  const sortedTimes = Object.keys(timelineMap).sort();

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-blue-400 mb-6 flex items-center gap-2">
        <Clock size={20} /> Daily Timeline
      </h2>
      
      <div className="relative border-l border-slate-700 ml-3 space-y-8 pb-4">
        {sortedTimes.length === 0 && (
          <div className="pl-6 text-sm text-slate-500">No scheduled items found. Add schedule times to your supplements and meals!</div>
        )}
        
        {sortedTimes.map((time, idx) => {
          const items = timelineMap[time];
          // Use the type of the first item to color the dot, or a mixed color
          const hasMeal = items.some(i => i.type === 'meal');
          const Icon = hasMeal ? Utensils : Pill;
          const colorClass = hasMeal ? 'text-emerald-400' : 'text-indigo-400';

          return (
            <div key={`${time}-${idx}`} className="relative pl-6">
              <div className={`absolute -left-[1.1rem] top-1 rounded-full border-4 border-[#0b0f19] bg-slate-800 p-1 ${colorClass}`}>
                <Icon size={14} />
              </div>
              
              <div className="mb-2">
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md">
                  {time}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => (
                  <div key={`${item.type}-${item.id}`} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl transition-all hover:bg-slate-800/80">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-slate-200">{item.title}</h3>
                      {item.type === 'supplement' ? <Pill size={14} className="text-indigo-400/50" /> : <Utensils size={14} className="text-emerald-400/50" />}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-1">{item.subtitle}</p>
                    <p className="text-[11px] text-slate-500 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
