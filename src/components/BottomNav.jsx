import { Activity, Dumbbell, MessageSquare, Settings, Clock, Camera } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
      className={`flex flex-col items-center justify-center w-full p-2 rounded-xl transition-all duration-200 ${active ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-700'}`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
