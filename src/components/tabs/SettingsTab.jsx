import { useStore } from '../../store';
import { AlertTriangle, Download, Upload } from 'lucide-react';
import { useRef } from 'react';

export default function SettingsTab() {
  const profile = useStore(state => state.profile);
  const updateProfile = useStore(state => state.updateProfile);
  const importData = useStore(state => state.importData);
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const stateToExport = JSON.parse(localStorage.getItem('jen-fitness-app-storage'));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateToExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jen-fitness-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.state) {
            importData(imported.state);
            alert("Data imported successfully!");
        } else {
            alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error parsing backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="space-y-6">
      
      {/* Medical Profile */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-emerald-600 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} /> Medical & Context Profile
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">SI Joint Pathology Status</label>
            <select 
              value={profile.siJointPain ? "true" : "false"} 
              onChange={e => updateProfile({ siJointPain: e.target.value === "true" })}
              className="w-full mt-1.5 bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
            >
              <option value="true">Active Inflammation (Enforce Strict Load Restrictions)</option>
              <option value="false">Asymptomatic / Cleared for Mechanical Loading</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Long Term Goals & Context</label>
            <textarea 
              value={profile.goals}
              onChange={e => updateProfile({ goals: e.target.value })}
              className="w-full mt-1.5 bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-blue-500 h-24 resize-none custom-scrollbar"
              placeholder="Describe your primary fitness goals and any other health conditions..."
            />
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-indigo-400 mb-4">App Settings</h2>
        
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Gemini API Key</label>
          <input 
            type="password" 
            value={profile.apiKey}
            onChange={e => updateProfile({ apiKey: e.target.value })}
            placeholder="AIzaSy..."
            className="w-full mt-1.5 bg-white shadow-sm border border-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-xs text-gray-400 mt-2">
            Stored locally in your browser. Required for the Virtual Coach and Week Generation.
          </p>
          <button 
            onClick={async () => {
              try {
                if (!profile.apiKey) {
                  alert("Please paste your API key first!");
                  return;
                }
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${profile.apiKey.trim()}`);
                if (!res.ok) {
                  const errorText = await res.text();
                  alert(`API Error: ${res.status}\n${errorText}`);
                  return;
                }
                const data = await res.json();
                const modelNames = data.models.map(m => m.name).join('\n');
                alert(`SUCCESS! Your key has access to these models:\n\n${modelNames}`);
              } catch (err) {
                alert(`Network Error: ${err.message}`);
              }
            }}
            className="mt-4 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Debug API Key (List Models)
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-4">Data Management</h2>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-700/50 text-emerald-100 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Download size={16} /> Export Backup JSON
          </button>
          
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 px-4 py-2 rounded-xl text-sm transition-colors"
          >
            <Upload size={16} /> Import Backup JSON
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
        </div>
        <p className="text-[11px] text-gray-400 mt-3">Export your data regularly so you can migrate it to the cloud later without losing progress.</p>
      </div>

    </div>
  );
}
