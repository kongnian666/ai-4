import React from 'react';
import { Calendar, LayoutDashboard, Settings, MessageSquare, BarChart3, Clock, QrCode } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'calendar' | 'analytics' | 'settings' | 'feedback';
  onChangeView: (view: 'dashboard' | 'calendar' | 'analytics' | 'settings' | 'feedback') => void;
  onScanClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onScanClick }) => {
  const menuItems = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'calendar', label: '考勤日历', icon: Calendar },
    { id: 'analytics', label: '统计报表', icon: BarChart3 },
    { id: 'feedback', label: '反馈建议', icon: MessageSquare },
  ] as const;

  return (
    <div className="hidden md:flex w-20 md:w-64 bg-white border-r border-slate-200 h-screen flex-col fixed left-0 top-0 z-10 transition-all duration-300">
      <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-100">
        <Clock className="w-8 h-8 text-blue-600" />
        <span className="ml-3 font-bold text-xl text-slate-800 hidden md:block">智考勤</span>
      </div>

      <div className="px-4 py-4">
        <button 
            onClick={onScanClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center transition-colors shadow-sm mb-2"
        >
            <QrCode size={20} />
            <span className="ml-2 font-medium hidden md:block">扫码打卡</span>
        </button>
      </div>

      <nav className="flex-1 py-2 px-2 md:px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-center md:justify-start px-2 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`ml-3 font-medium hidden md:block ${isActive ? 'text-blue-700' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
         <button 
            onClick={() => onChangeView('settings')}
            className={`w-full flex items-center justify-center md:justify-start px-2 py-3 rounded-xl transition-colors ${
                currentView === 'settings' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
         >
            <Settings className="w-6 h-6" />
            <span className="ml-3 font-medium hidden md:block">设置</span>
         </button>
         <div className="mt-4 flex items-center justify-center md:justify-start px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div className="ml-3 hidden md:block">
                <p className="text-sm font-semibold text-slate-700">管理员</p>
                <p className="text-xs text-slate-400">admin@school.edu</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
