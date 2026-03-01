import React from 'react';
import { Calendar, LayoutDashboard, Settings, MessageSquare, QrCode } from 'lucide-react';

interface MobileNavProps {
  currentView: string;
  onChangeView: (view: any) => void;
  onScanClick: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ currentView, onChangeView, onScanClick }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex justify-between items-center z-40 md:hidden safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => onChangeView('dashboard')}
        className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <LayoutDashboard size={24} />
        <span className="text-[10px] mt-1">总览</span>
      </button>

      <button 
        onClick={() => onChangeView('calendar')}
        className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'calendar' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <Calendar size={24} />
        <span className="text-[10px] mt-1">日历</span>
      </button>

      {/* Main Action Button for Scan */}
      <div className="relative -top-5">
        <button 
            onClick={onScanClick}
            className="w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors border-4 border-slate-50"
        >
            <QrCode size={28} />
        </button>
      </div>

      <button 
        onClick={() => onChangeView('feedback')}
        className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'feedback' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <MessageSquare size={24} />
        <span className="text-[10px] mt-1">反馈</span>
      </button>

      <button 
        onClick={() => onChangeView('settings')}
        className={`flex flex-col items-center p-2 rounded-lg ${currentView === 'settings' ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <Settings size={24} />
        <span className="text-[10px] mt-1">设置</span>
      </button>
    </div>
  );
};

export default MobileNav;
