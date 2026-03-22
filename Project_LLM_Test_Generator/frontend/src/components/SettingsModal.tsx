import { useState } from 'react';
import { X, Save, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  activeModel: string;
  setActiveModel: (model: string) => void;
  config: any;
  setConfig: (config: any) => void;
}

export default function SettingsModal({ onClose, activeModel, setActiveModel, config, setConfig }: SettingsModalProps) {
  const [selectedProvider, setSelectedProvider] = useState(activeModel);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const providers = [
    { id: 'Ollama', label: 'Ollama API', urlPlaceholder: 'http://localhost:11434/api/generate', needsKey: false },
    { id: 'LMStudio', label: 'LM Studio API', urlPlaceholder: 'http://localhost:1234/v1', needsKey: false },
    { id: 'Groq', label: 'Groq API', urlPlaceholder: 'https://api.groq.com/openai/v1', needsKey: true },
    { id: 'OpenAI', label: 'OpenAI API', urlPlaceholder: 'https://api.openai.com/v1', needsKey: true },
    { id: 'Claude', label: 'Anthropic Claude', urlPlaceholder: 'https://api.anthropic.com/v1/messages', needsKey: true },
    { id: 'Gemini', label: 'Google Gemini', urlPlaceholder: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', needsKey: true },
  ];

  const activeProviderInfo = providers.find(p => p.id === selectedProvider);

  const handleInputChange = (field: string, value: string) => {
    setConfig({
      ...config,
      [selectedProvider]: {
        ...config[selectedProvider],
        [field]: value
      }
    });
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      const response = await fetch('http://localhost:3001/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          ...config[selectedProvider]
        })
      });
      const data = await response.json();
      if (data.success) {
        setConnectionStatus('success');
        setTestMessage(data.message);
      } else {
        setConnectionStatus('failed');
        setTestMessage(data.error);
      }
    } catch (err) {
      setConnectionStatus('failed');
      setTestMessage('Backend unreachable');
    }
  };

  const handleSave = () => {
    setActiveModel(selectedProvider);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
              <Activity size={18} className="text-indigo-400" />
            </span>
            LLM Configurations
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex gap-6 nice-scrollbar">
          <div className="w-1/3 flex flex-col gap-2">
            {providers.map(provider => (
              <button
                key={provider.id}
                onClick={() => { setSelectedProvider(provider.id); setConnectionStatus('idle'); }}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${selectedProvider === provider.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
              >
                {provider.label}
                {activeModel === provider.id && <div className="w-2 h-2 rounded-full bg-green-400"></div>}
              </button>
            ))}
          </div>

          <div className="w-2/3 bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="text-lg font-medium text-white mb-4">{activeProviderInfo?.label} Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Base URL</label>
                <input 
                  type="text" 
                  value={config[selectedProvider]?.baseUrl || ''}
                  onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder={activeProviderInfo?.urlPlaceholder}
                />
              </div>

              {activeProviderInfo?.needsKey && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                  <input 
                    type="password" 
                    value={config[selectedProvider]?.apiKey || ''}
                    onChange={(e) => handleInputChange('apiKey', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="sk-..."
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Model Name</label>
                <input 
                  type="text" 
                  value={config[selectedProvider]?.model || ''}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder={activeProviderInfo?.id === 'Ollama' ? 'llama3' : 'e.g. gpt-4'}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={testConnection}
              disabled={connectionStatus === 'testing'}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors border border-slate-600"
            >
              {connectionStatus === 'testing' ? <Activity size={16} className="animate-spin" /> : <Activity size={16} />}
              Test Connection
            </button>
            
            {connectionStatus === 'success' && <div className="text-emerald-400 flex items-center gap-1 text-sm"><CheckCircle2 size={16} /> {testMessage || 'Success'}</div>}
            {connectionStatus === 'failed' && <div className="text-red-400 flex items-center gap-1 text-sm"><AlertCircle size={16} /> {testMessage || 'Failed'}</div>}
          </div>

          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Save size={16} />
            Save & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
