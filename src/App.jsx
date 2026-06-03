import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardTab from './components/tabs/DashboardTab';
import TrainingTab from './components/tabs/TrainingTab';
import CoachTab from './components/tabs/CoachTab';
import SettingsTab from './components/tabs/SettingsTab';
import ScheduleTab from './components/tabs/ScheduleTab';
import ScannerTab from './components/tabs/ScannerTab';
import NotificationEngine from './components/NotificationEngine';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f1f5f9] font-sans pb-20 md:pb-0">
      <NotificationEngine />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'schedule' && <ScheduleTab />}
        {activeTab === 'scanner' && <ScannerTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'coach' && <CoachTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
