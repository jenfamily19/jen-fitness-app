import { useStore } from '../store';
import { Activity, Dumbbell, MessageSquare, Settings, Clock, Camera } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const currentWeek = useStore(state => state.currentWeek);
  
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-8 border-b border-gray-200 bg-white w-full">
      <div className="max-w-7xl mx-auto flex w-full justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 drop-shadow-sm">
            Jen Fitness App
          </h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Week {currentWeek} Active</p>
        </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-2">
        <NavButton id="dashboard" icon={<Activity size={18} />} label="Overview" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="schedule" icon={<Clock size={18} />} label="Schedule" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="scanner" icon={<Camera size={18} />} label="Scanner" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="training" icon={<Dumbbell size={18} />} label="Training" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="coach" icon={<MessageSquare size={18} />} label="Virtual Coach" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="settings" icon={<Settings size={18} />} label="Settings" activeTab={activeTab} onClick={setActiveTab} />
      </nav>
      </div>
    </header>
  );
}

function NavButton({ id, icon, label, activeTab, onClick }) {
  const active = activeTab === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${active ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent'}`}
    >
      {icon} {label}
    </button>
  );
}
