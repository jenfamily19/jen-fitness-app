import { useStore } from '../store';
import { Activity, Dumbbell, MessageSquare, Settings, Clock, Camera } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  const currentWeek = useStore(state => state.currentWeek);
  
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 md:p-8 border-b border-slate-800 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
          Jen Fitness App
        </h1>
        <p className="text-slate-400 text-sm mt-1">Week {currentWeek} Active</p>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-2">
        <NavButton id="dashboard" icon={<Activity size={18} />} label="Dashboard" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="schedule" icon={<Clock size={18} />} label="Schedule" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="scanner" icon={<Camera size={18} />} label="Scanner" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="training" icon={<Dumbbell size={18} />} label="Training" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="coach" icon={<MessageSquare size={18} />} label="Virtual Coach" activeTab={activeTab} onClick={setActiveTab} />
        <NavButton id="settings" icon={<Settings size={18} />} label="Settings" activeTab={activeTab} onClick={setActiveTab} />
      </nav>
    </header>
  );
}

function NavButton({ id, icon, label, activeTab, onClick }) {
  const active = activeTab === id;
  return (
    <button 
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
    >
      {icon} {label}
    </button>
  );
}
