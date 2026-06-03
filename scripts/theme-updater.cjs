const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-\[\#0b0f19\]/g, to: 'bg-gray-50' },
  { from: /bg-slate-950/g, to: 'bg-white shadow-sm border border-gray-100' },
  { from: /bg-slate-900/g, to: 'bg-white shadow-sm border border-gray-100' },
  { from: /bg-slate-800\/50/g, to: 'bg-gray-50' },
  { from: /bg-slate-800/g, to: 'bg-gray-100' },
  { from: /bg-slate-700/g, to: 'bg-gray-200' },
  { from: /border-slate-800/g, to: 'border-gray-200' },
  { from: /border-slate-700/g, to: 'border-gray-200' },
  { from: /text-\[\#f1f5f9\]/g, to: 'text-gray-900' },
  { from: /text-white/g, to: 'text-gray-900' }, // Be careful with buttons!
  { from: /text-slate-200/g, to: 'text-gray-800' },
  { from: /text-slate-300/g, to: 'text-gray-700' },
  { from: /text-slate-400/g, to: 'text-gray-500' },
  { from: /text-slate-500/g, to: 'text-gray-400' },
  { from: /from-blue-400/g, to: 'from-emerald-500' },
  { from: /to-indigo-400/g, to: 'to-teal-500' },
  { from: /from-blue-500/g, to: 'from-emerald-500' },
  { from: /to-indigo-500/g, to: 'to-teal-500' },
  { from: /bg-blue-600/g, to: 'bg-emerald-600 text-white' }, // Force text-white on primary buttons
  { from: /hover:bg-blue-700/g, to: 'hover:bg-emerald-700' },
  { from: /text-blue-400/g, to: 'text-emerald-600' },
  { from: /text-blue-500/g, to: 'text-emerald-600' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We already manually did App.jsx, Header.jsx, BottomNav.jsx, skip them to prevent double replace
      if (file === 'App.jsx' || file === 'Header.jsx' || file === 'BottomNav.jsx') continue;

      let newContent = content;
      for (const rep of replacements) {
        newContent = newContent.replace(rep.from, rep.to);
      }
      
      // Fix double classes like "bg-white shadow-sm border border-gray-100 shadow-sm border border-gray-100"
      // or "text-gray-900 text-white" on buttons
      newContent = newContent.replace(/text-gray-900\s+text-white/g, 'text-white');
      newContent = newContent.replace(/bg-emerald-600\s+text-white\s+text-gray-900/g, 'bg-emerald-600 text-white');

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated theme in ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, '../src'));
