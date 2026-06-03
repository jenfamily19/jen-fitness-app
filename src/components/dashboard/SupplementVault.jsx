import { useStore } from '../../store';
import { Pill, Plus, X, Clock } from 'lucide-react';
import { useEffect } from 'react';

export default function SupplementVault() {
  const supplements = useStore(state => state.supplements);
  const updateSupplement = useStore(state => state.updateSupplement);
  const deleteSupplement = useStore(state => state.deleteSupplement);
  const addSupplement = useStore(state => state.addSupplement);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  const handleStockChange = (id, newStock, alertLimit, name) => {
    updateSupplement(id, { stock: newStock });
    if (newStock <= alertLimit && "Notification" in window && Notification.permission === "granted") {
      new Notification(`Restock Reminder`, {
        body: `${name} stock is at ${newStock}. Time to restock!`,
      });
    }
  };

  const handleAdd = () => {
    const name = prompt("Enter Supplement Name:");
    if (name) {
      addSupplement({ name, stock: 100, alert: 10, daily: 1, unit: "caps", time: "Flexible Schedule" });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-indigo-400 flex items-center gap-2">
          <Pill size={20} /> Supplement Vault
        </h2>
        <button onClick={handleAdd} className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1.5 rounded-md font-medium transition-colors">
          <Plus size={14} /> Add Item
        </button>
      </div>
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
        {supplements.map(supp => {
          const isAlert = supp.stock <= supp.alert;
          return (
            <div key={supp.id} className={`p-3 rounded-xl bg-white shadow-sm border border-gray-100/60 border ${isAlert ? 'border-amber-500/30 bg-amber-950/10' : 'border-gray-200'} flex flex-col gap-2`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-medium text-sm ${isAlert ? 'text-amber-400' : 'text-gray-800'}`}>{supp.name}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{supp.time}</p>
                </div>
                <button onClick={() => deleteSupplement(supp.id)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-200/50">
                <span className="text-xs text-gray-500">Inventory:</span>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="number" 
                    value={supp.stock} 
                    onChange={(e) => handleStockChange(supp.id, Number(e.target.value), supp.alert, supp.name)}
                    className="w-16 bg-gray-100 text-center text-xs p-1 rounded font-semibold text-gray-900 outline-none"
                  />
                  <span className="text-xs text-gray-500">{supp.unit}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-1 pt-2 border-t border-gray-200/50">
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> Alert Time:</span>
                <input 
                  type="time" 
                  value={supp.scheduleTime || ""} 
                  onChange={(e) => updateSupplement(supp.id, { scheduleTime: e.target.value })}
                  className="bg-gray-100 text-xs p-1 rounded text-gray-900 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              {isAlert && <div className="text-[10px] text-amber-400 font-medium mt-0.5">⚠️ Restock Target Reached (Threshold: {supp.alert}{supp.unit})</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
