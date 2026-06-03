import { useState } from 'react';
import { useStore } from '../../store';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

export default function CoachTab() {
  const apiKey = useStore(state => state.profile.apiKey);
  const profile = useStore(state => state.profile);
  const telemetry = useStore(state => state.telemetry);
  const currentWeek = useStore(state => state.currentWeek);
  const workouts = useStore(state => state.workouts);
  const generateNextWeek = useStore(state => state.generateNextWeek);
  const chatHistory = useStore(state => state.chatHistory);
  const addChatMessage = useStore(state => state.addChatMessage);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const getSystemPrompt = () => {
    return `You are the Virtual AI Coach for Jen Fitness App.
The user is currently on Week ${currentWeek}.
Telemetry: Energy ${telemetry.energy}/10, Sleep ${telemetry.sleep}/10.
Medical Profile: SI Joint Pain is ${profile.siJointPain ? "ACTIVE (STRICT LOAD RESTRICTIONS)" : "Asymptomatic"}.
Goals: ${profile.goals}
Workouts logged this week: ${JSON.stringify(workouts.map(w => w.name))}
Please be concise, encouraging, and provide scientifically sound fitness advice.`;
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    
    const userMessage = { role: 'user', text: input };
    addChatMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `${getSystemPrompt()}\n\nUser: ${input}`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `API Error: ${response.status}`);
      }
      
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that.";
      addChatMessage({ role: 'bot', text: botText });
    } catch (err) {
      console.error("Gemini API Error:", err);
      addChatMessage({ role: 'bot', text: `API Error: ${err.message}. Please double check your API key in Settings.` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWeek = async () => {
    if (!apiKey) {
      alert("Please enter your Gemini API Key in the Settings tab first.");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const prompt = `You are the backend AI optimization engine for Jen Fitness App.
Generate the weekly workout plan for Week ${currentWeek + 1}.
Medical Profile: SI Joint Pain is ${profile.siJointPain ? "ACTIVE" : "FALSE"}. If active, NO squats, deadlifts, or heavy axial loading.
Goals: ${profile.goals}
Output ONLY valid JSON representing the 'workouts' array with this structure:
[
  { "dayId": "day1", "name": "...", "exercises": [ { "name": "...", "sets": 3, "target": "10-12 reps", "weight": 0, "rpe": 8, "tip": "..." } ] }
]
Do not include markdown blocks or any other text. JUST JSON.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      let responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const newWorkouts = JSON.parse(responseText);
      if (Array.isArray(newWorkouts)) {
        generateNextWeek(newWorkouts);
        alert(`Week ${currentWeek + 1} generated successfully!`);
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      alert("Error generating week: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
      
      {/* Chat Area */}
      <div className="lg:col-span-2 glass-panel rounded-2xl flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="font-semibold text-blue-400 flex items-center gap-2">
            <MessageSquare size={20} /> Virtual Coach
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {chatHistory.length === 0 && (
            <div className="text-center text-slate-500 mt-10 text-sm">
              Ask your coach anything! Example: "Why is my energy low this week?" or "How can I improve my incline bench?"
            </div>
          )}
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-700 text-sm italic">
                Thinking...
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={apiKey ? "Message your coach..." : "Enter API Key in Settings first"}
              disabled={!apiKey || isLoading}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={!apiKey || isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="glass-panel rounded-2xl p-6 h-fit">
        <h3 className="font-semibold text-indigo-400 mb-4 flex items-center gap-2">
          <Sparkles size={20} /> Week Generator
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          The AI will analyze your telemetry (Energy: {telemetry.energy}, Sleep: {telemetry.sleep}) and medical profile to generate the perfect workout plan for Week {currentWeek + 1}. Your current week's history will be saved.
        </p>
        <button 
          onClick={handleGenerateWeek}
          disabled={isGenerating}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex justify-center items-center gap-2"
        >
          {isGenerating ? "Analyzing..." : `Generate Week ${currentWeek + 1} 🚀`}
        </button>
      </div>

    </div>
  );
}
