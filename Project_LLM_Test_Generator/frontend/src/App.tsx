import { useState, useEffect } from 'react';
import { MessageSquare, Settings } from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import ChatArea from './components/ChatArea';
import Sidebar from './components/Sidebar';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeModel, setActiveModel] = useState('Ollama');
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('llm_config');
    return saved ? JSON.parse(saved) : {
      Ollama: { baseUrl: 'http://localhost:11434/api/generate', model: 'gemma3:4b' },
      LMStudio: { baseUrl: 'http://localhost:1234/v1', model: 'model-identifier' },
      Groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama3-8b-8192', apiKey: '' },
      OpenAI: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', apiKey: '' },
      Claude: { baseUrl: 'https://api.anthropic.com/v1/messages', model: 'claude-3-opus-20240229', apiKey: '' },
      Gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', model: 'gemini-pro', apiKey: '' }
    };
  });

  useEffect(() => {
    localStorage.setItem('llm_config', JSON.stringify(config));
  }, [config]);

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative border-l border-slate-800">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">LLMTestGenBuddy AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-slate-300">Active: <span className="text-white font-medium">{activeModel}</span></span>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
        <ChatArea activeModel={activeModel} config={config} />
      </div>

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)} 
          activeModel={activeModel} 
          setActiveModel={setActiveModel}
          config={config}
          setConfig={setConfig} 
        />
      )}
    </div>
  );
}

export default App;
