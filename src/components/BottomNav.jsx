import { Activity, Dumbbell, MessageSquare, Settings, Clock, Camera } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0b0f19]/90 backdrop-blur-lg border-t border-slate-800 flex justify-around p-2 z-50 pb-safe">
      <NavItem id="dashboard" icon={<Activity size={20} />} label="Overview" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem id="schedule" icon={<Clock size={20} />} label="Schedule" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem id="scanner" icon={<Camera size={20} />} label="Scanner" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem id="training" icon={<Dumbbell size={20} />} label="Workout" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem id="coach" icon={<MessageSquare size={20} />} label="Coach" activeTab={activeTab} onClick={setActiveTab} />
      <NavItem id="settings" icon={<Settings size={20} />} label="Settings" activeTab={activeTab} onClick={setActiveTab} />
    </div>
  );
}

function NavItem({ id, icon, label, activeTab, onClick }) {
  const active = activeTab === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`flex flex-col items-center justify-center w-full p-2 rounded-xl transition-all ${active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
