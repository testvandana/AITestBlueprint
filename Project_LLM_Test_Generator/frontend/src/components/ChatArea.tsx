import { useState } from 'react';
import { Send, FileDown, Copy, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ChatAreaProps {
  activeModel: string;
  config: any;
}

export default function ChatArea({ activeModel, config }: ChatAreaProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTests, setGeneratedTests] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedTests(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeModel,
          baseUrl: config[activeModel]?.baseUrl,
          apiKey: config[activeModel]?.apiKey,
          model: config[activeModel]?.model,
          prompt: prompt
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedTests(data.testCases);
      } else {
        setError(data.error || 'Failed to generate test cases.');
      }
    } catch (err) {
      setError('Backend unreachable. Ensure the server is running on port 3001.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportExcel = () => {
    if (!generatedTests) return;
    const worksheet = XLSX.utils.json_to_sheet(generatedTests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");
    XLSX.writeFile(workbook, "LLM_Generated_TestCases.xlsx");
  };

  const handleCopy = () => {
    if (!generatedTests) return;
    const markdownTable = `| Issue Key | Summary | Description | Steps to Reproduce | Expected Result | Priority |
|---|---|---|---|---|---|
${generatedTests.map(t => `| ${t["Issue Key"]} | ${t.Summary} | ${t.Description} | ${String(t["Steps to Reproduce"]).replace(/\n/g, '<br>')} | ${t["Expected Result"]} | ${t.Priority} |`).join('\n')}`;
    navigator.clipboard.writeText(markdownTable);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-8 nice-scrollbar">
        {!generatedTests && !isGenerating && !error ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 ring-1 ring-indigo-500/20">
              <Sparkles className="w-8 h-8 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-200">What would you like to test?</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Describe your API or web application requirements. <br/>
              I will generate comprehensive functional and non-functional test cases in Jira format.
            </p>
          </div>
        ) : isGenerating ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-indigo-300 font-medium animate-pulse">Generating Test Cases via {activeModel}...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={() => setError(null)} className="text-slate-400 underline text-sm">Try again</button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl mb-12">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-slate-200">Generated Test Cases</h3>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium">
                  <Copy size={16} /> Copy Jira Format
                </button>
                <button onClick={handleExportExcel} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-sm font-medium shadow-lg shadow-emerald-500/20">
                  <FileDown size={16} /> Export to Excel
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-slate-300 border-collapse table-auto">
                <thead className="bg-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-700">Key</th>
                    <th className="px-6 py-3 border-b border-slate-700">Summary</th>
                    <th className="px-6 py-3 border-b border-slate-700">Steps</th>
                    <th className="px-6 py-3 border-b border-slate-700">Expected</th>
                    <th className="px-6 py-3 border-b border-slate-700">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {generatedTests?.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-indigo-400 font-mono text-[10px]">{t["Issue Key"]}</td>
                      <td className="px-6 py-4 font-medium text-slate-200">{t.Summary}</td>
                      <td className="px-6 py-4 text-[11px] text-slate-400 whitespace-pre-wrap max-w-xs">{t["Steps to Reproduce"]}</td>
                      <td className="px-6 py-4 text-[11px] text-slate-400">{t["Expected Result"]}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold 
                          ${t.Priority === 'High' ? 'bg-red-500/20 text-red-500' : t.Priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {t.Priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800/50">
        <div className="max-w-4xl mx-auto relative group">
          <textarea 
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 pr-32 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-sm h-32 nice-scrollbar"
            placeholder="E.g., I need functional test cases for a new POST /api/v1/users endpoint that accepts email, password, and age..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-medium hidden sm:block">Press Enter ↵</span>
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium disabled:shadow-none"
            >
              <Send size={16} />
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
