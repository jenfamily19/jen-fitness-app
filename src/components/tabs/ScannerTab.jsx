import { useState, useRef } from 'react';
import { useStore } from '../../store';
import { Camera, Upload, AlertCircle, Loader2, Save, Trash2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ScannerTab() {
  const profile = useStore(state => state.profile);
  const scannedMeals = useStore(state => state.scannedMeals);
  const addScannedMeal = useStore(state => state.addScannedMeal);
  const deleteScannedMeal = useStore(state => state.deleteScannedMeal);
  
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      // Reset state on new image
      setResult(null);
      setError(null);
    }
  };

  const analyzeMeal = async () => {
    if (!profile.apiKey) {
      setError("Please add your Gemini API Key in the Settings tab first.");
      return;
    }
    if (!image) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const promptText = `
You are a world-class nutritionist and dietitian. Analyze the provided image of a meal.
User context/description: "${context || 'None provided'}"

Return a structured JSON breakdown of the meal's nutritional content. The JSON must exactly follow this format:
{
  "name": "Brief name of the meal",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "fiber": 0,
  "sugar": 0,
  "summary": "A short 1-2 sentence health breakdown"
}

Respond ONLY with the JSON object, absolutely no markdown wrappers like \`\`\`json.
      `;

      const genAI = new GoogleGenerativeAI(profile.apiKey.trim());
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent([
        promptText,
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type || 'image/jpeg'
          }
        }
      ]);
      
      const response = await result.response;
      let responseText = response.text();
      
      if (!responseText) {
        throw new Error("No response from AI.");
      }

      if (responseText.startsWith('```json')) {
          responseText = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
      }

      const parsed = JSON.parse(responseText);
      setResult(parsed);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to analyze meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (result) {
      addScannedMeal({
        ...result,
        imageUrl: image // Storing the base64 string locally. In a real cloud app, this would be uploaded to storage.
      });
      // Clear current form
      setImage(null);
      setImageFile(null);
      setContext("");
      setResult(null);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-panel rounded-2xl p-4 md:p-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center gap-2 mb-4">
          <Camera size={24} className="text-emerald-400" /> AI Macro Scanner
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          Snap a photo of an off-plan meal. Gemini Vision will analyze the contents and estimate the nutritional breakdown.
        </p>

        {!profile.apiKey && (
          <div className="mb-6 bg-amber-950/30 border border-amber-900/50 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div className="text-sm text-amber-200">
              API Key Missing. Please set your Gemini API Key in the Settings tab to use the Macro Scanner.
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video md:aspect-[21/9] rounded-xl border-2 border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all overflow-hidden relative"
          >
            {image ? (
              <img src={image} alt="Meal preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-500 p-4 text-center">
                <Upload size={32} className="mb-2" />
                <span className="font-semibold">Tap to select meal photo</span>
                <span className="text-xs mt-1">JPEG, PNG, WEBP</span>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Context Input */}
          <input 
            type="text" 
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Add context (optional)... e.g. 'Mom's lasagna, lots of cheese'"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 outline-none"
          />

          {/* Error Message */}
          {error && <div className="text-xs font-semibold text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/50">{error}</div>}

          {/* Analyze Button */}
          <button 
            onClick={analyzeMeal} 
            disabled={loading || !image}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Scanning...</> : <><Camera size={18} /> Analyze Meal</>}
          </button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <h3 className="font-bold text-slate-200 text-lg mb-4">{result.name}</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MetricCard label="Calories" value={result.calories} unit="kcal" color="text-amber-400" />
              <MetricCard label="Protein" value={result.protein} unit="g" color="text-indigo-400" />
              <MetricCard label="Carbs" value={result.carbs} unit="g" color="text-emerald-400" />
              <MetricCard label="Fats" value={result.fats} unit="g" color="text-rose-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <MetricCard label="Fiber" value={result.fiber} unit="g" color="text-slate-300" small />
              <MetricCard label="Sugar" value={result.sugar} unit="g" color="text-slate-300" small />
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6">
              <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
            </div>

            <button 
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-3 px-4 rounded-xl border border-slate-700 transition-colors"
            >
              <Save size={18} /> Save to Log
            </button>
          </div>
        )}
      </div>

      {/* Logged Meals History */}
      {scannedMeals.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 md:p-6">
          <h3 className="font-semibold text-slate-200 mb-4">Saved Scans</h3>
          <div className="space-y-3">
            {scannedMeals.map(meal => (
              <div key={meal.id} className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-3 rounded-xl">
                <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                  <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-slate-200">{meal.name}</h4>
                  <div className="flex gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                    <span className="text-amber-400">{meal.calories} kcal</span>
                    <span>•</span>
                    <span className="text-indigo-400">{meal.protein}g P</span>
                    <span className="text-emerald-400">{meal.carbs}g C</span>
                    <span className="text-rose-400">{meal.fats}g F</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{new Date(meal.dateLogged).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteScannedMeal(meal.id)} className="text-slate-600 hover:text-red-400 transition-colors p-2 shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, unit, color, small = false }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-center items-center text-center ${small ? 'p-2' : 'p-3'}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`font-black ${small ? 'text-lg' : 'text-2xl'} ${color}`}>{value}</span>
        <span className="text-xs text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}
