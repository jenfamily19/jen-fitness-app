import { useStore } from '../../store';
import { AlertTriangle, Download, Upload, Copy, Check, X, RefreshCw, Database } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function SettingsTab() {
  const profile = useStore(state => state.profile);
  const updateProfile = useStore(state => state.updateProfile);
  const safeImportPlan = useStore(state => state.safeImportPlan);
  const fileInputRef = useRef(null);

  // Modal States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  // Interaction States
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Auto-hide success toast
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Legacy File Handlers
  const handleLegacyExport = () => {
    const stateToExport = JSON.parse(localStorage.getItem('jen-fitness-app-storage'));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stateToExport));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "jen-fitness-backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleLegacyImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported && imported.state) {
            safeImportPlan(imported.state);
            setSuccessToast("Backup file imported successfully!");
        } else {
            alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error parsing backup file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  // Coach Sync Logic
  const getStateToExport = () => {
    try {
        const raw = localStorage.getItem('jen-fitness-app-storage');
        if (!raw) return "{}";
        const parsed = JSON.parse(raw);
        // Returns minified JSON string
        return JSON.stringify(parsed);
    } catch(e) {
        return "{}";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getStateToExport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncData = () => {
    setImportError('');
    if (!importText.trim()) {
      setImportError('Please paste the JSON string provided by your coach.');
      return;
    }
    
    try {
      const parsedData = JSON.parse(importText);
      
      // Validation Check
      if (!parsedData || !parsedData.state) {
          throw new Error("Invalid format: Missing the 'state' root object.");
      }
      
      const { currentWeek, workouts, meals, supplements } = parsedData.state;
      
      const hasValidWorkouts = Array.isArray(workouts);
      const hasValidMeals = Array.isArray(meals);
      const hasValidSupplements = Array.isArray(supplements);
      const hasValidWeek = currentWeek !== undefined;
      
      if (!hasValidWeek && !hasValidWorkouts && !hasValidMeals && !hasValidSupplements) {
          throw new Error("Validation Failed: The payload must contain at least one valid update array (workouts, meals, supplements) or currentWeek.");
      }

      // Hydrate Global State
      safeImportPlan(parsedData);
      
      // Cleanup & Success
      setIsImportOpen(false);
      setImportText('');
      setSuccessToast('App Data Successfully Synchronized!');
      
    } catch (err) {
      setImportError(err.message || 'Failed to parse JSON. Please check for missing brackets or typos.');
    }
  };

  return (
    <div className="space-y-6 pb-12 relative">
      
      {/* Toast Notification */}
      {successToast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg font-semibold text-sm z-[100] flex items-center gap-2 animate-bounce">
              <Check size={18} /> {successToast}
          </div>
      )}

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
              className="w-full mt-1.5 bg-white shadow-sm border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
              className="w-full mt-1.5 bg-white shadow-sm border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 h-24 resize-none custom-scrollbar"
              placeholder="Describe your primary fitness goals and any other health conditions..."
            />
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-teal-600 mb-4">API Configuration</h2>
        
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Gemini API Key</label>
          <input 
            type="password" 
            value={profile.apiKey}
            onChange={e => updateProfile({ apiKey: e.target.value })}
            placeholder="AIzaSy... or AQ..."
            className="w-full mt-1.5 bg-white shadow-sm border border-gray-200 rounded-lg p-3 text-sm text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
            className="mt-4 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            Debug API Key (List Models)
          </button>
        </div>
      </div>

      {/* Coach Synchronization */}
      <div className="glass-panel rounded-2xl p-6 border-emerald-200 bg-emerald-50/30">
        <h2 className="text-lg font-semibold text-emerald-700 mb-2 flex items-center gap-2">
          <RefreshCw size={20} /> Coach Synchronization
        </h2>
        <p className="text-sm text-gray-600 mb-6">Manually export your local telemetry to your AI Coach, and import updated week plans.</p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md"
          >
            <Download size={18} /> Export for Coach
          </button>
          
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md"
          >
            <Upload size={18} /> Import Update
          </button>
        </div>
      </div>

      {/* Legacy Data Management */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
          <Database size={16} /> Legacy File Backup
        </h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleLegacyExport}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Download size={14} /> Download .json File
          </button>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            <Upload size={14} /> Upload .json File
          </button>
          <input type="file" ref={fileInputRef} onChange={handleLegacyImport} accept=".json" className="hidden" />
        </div>
      </div>

      {/* EXPORT MODAL */}
      {isExportOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Download size={20} className="text-emerald-600" /> Export State for Coach
              </h3>
              <button onClick={() => setIsExportOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 mb-3">Copy this minified JSON payload and send it directly to your AI Coach for analysis.</p>
              <textarea 
                readOnly
                value={getStateToExport()}
                className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none custom-scrollbar resize-none"
              />
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 ${
                  copied 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 scale-95' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {isImportOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <Upload size={20} className="text-teal-600" /> Import Coach Update
              </h3>
              <button onClick={() => { setIsImportOpen(false); setImportError(''); }} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 mb-3">Paste the updated JSON plan from your AI Coach here to immediately sync the app.</p>
              
              {importError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start gap-2">
                  <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                  <p>{importError}</p>
                </div>
              )}
              
              <textarea 
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"state": { "currentWeek": 2, "workouts": [...], ... }, "version": 4}'
                className="w-full h-64 p-4 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-800 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 custom-scrollbar resize-none placeholder-gray-300 shadow-inner"
              />
            </div>
            
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => { setIsImportOpen(false); setImportError(''); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSyncData}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow-md"
              >
                <RefreshCw size={18} /> Sync App Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
