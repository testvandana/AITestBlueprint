import { History, Plus, FileText, Code2, TestTube2 } from 'lucide-react';

export default function Sidebar() {
  const mockHistory = [
    { id: 1, title: 'Login API Functional Tests', date: '2 hours ago', icon: <Code2 size={16} /> },
    { id: 2, title: 'User Profile Validation', date: 'Yesterday', icon: <FileText size={16} /> },
    { id: 3, title: 'Payment Gateway Edge Cases', date: 'Mar 5, 2026', icon: <TestTube2 size={16} /> }
  ];

  return (
    <div className="w-72 h-full bg-[#0f172a] flex flex-col pt-4 pb-4 px-3 relative z-20">
      <button className="flex items-center gap-2 w-full justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 font-medium transition-all duration-200">
        <Plus size={18} />
        New Test Plan
      </button>

      <div className="mt-8 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center gap-2 px-2 text-slate-400 mb-4 text-xs font-semibold uppercase tracking-wider">
          <History size={14} />
          History
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-1 nice-scrollbar">
          {mockHistory.map(item => (
            <button 
              key={item.id}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-800/80 transition-colors flex flex-col gap-1 group border border-transparent hover:border-slate-700"
            >
              <div className="flex items-center justify-between text-slate-200 group-hover:text-indigo-300">
                <span className="text-sm font-medium truncate flex-1 flex items-center gap-2">
                  <span className="text-slate-500 group-hover:text-indigo-400">{item.icon}</span>
                  {item.title}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium pl-6">{item.date}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
