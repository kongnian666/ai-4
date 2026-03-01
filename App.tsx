import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MonthView from './components/Calendar/MonthView';
import DayView from './components/Calendar/DayView';
import DashboardStats from './components/DashboardStats';
import SettingsView from './components/SettingsView';
import FeedbackView from './components/FeedbackView';
import QRScanner from './components/QRScanner';
import { MOCK_USERS, MOCK_COURSES, GENERATE_INITIAL_RECORDS } from './constants';
import { AttendanceRecord, AttendanceStatus, DayType, User, Course, Feedback } from './types';
import { analyzeAttendanceData } from './services/geminiService';
import { Sparkles, Loader2, Smartphone, Monitor } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'analytics' | 'settings' | 'feedback'>('calendar');
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // App Data State
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  
  // Feature State
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(false);

  // Initialize data
  useEffect(() => {
    setAttendanceRecords(GENERATE_INITIAL_RECORDS());
  }, []);

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setCalendarViewMode('day');
  };

  const handleUpdateStatus = (userId: string, courseId: string | undefined, status: AttendanceStatus) => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    // For simplicity, we only track one record per day per user in this demo logic, 
    // but the structure supports course-specific records.
    const existingIndex = attendanceRecords.findIndex(r => r.userId === userId && r.date === dateStr);
    
    const newRecord: AttendanceRecord = {
        id: existingIndex >= 0 ? attendanceRecords[existingIndex].id : `att-${dateStr}-${userId}`,
        userId,
        date: dateStr,
        courseId,
        status,
        checkInTime: status === AttendanceStatus.PRESENT ? format(new Date(), 'HH:mm') : undefined
    };

    if (existingIndex >= 0) {
        const updated = [...attendanceRecords];
        updated[existingIndex] = newRecord;
        setAttendanceRecords(updated);
    } else {
        setAttendanceRecords([...attendanceRecords, newRecord]);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    const monthStr = format(currentDate, 'yyyy年MM月', { locale: zhCN });
    
    const analysis = await analyzeAttendanceData(attendanceRecords, users, monthStr);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const handleQRScanSuccess = (decodedText: string) => {
    // Assume decodedText is userId
    const user = users.find(u => u.id === decodedText);
    if (user) {
        handleUpdateStatus(user.id, undefined, AttendanceStatus.PRESENT);
        alert(`打卡成功: ${user.name}`);
        setShowQRScanner(false);
    } else {
        alert(`无效的二维码或用户ID: ${decodedText}`);
    }
  };

  const handleFeedbackSubmit = (content: string, type: 'bug' | 'suggestion' | 'other') => {
    const newFeedback: Feedback = {
        id: `fb-${Date.now()}`,
        userId: 'anonymous',
        content,
        timestamp: new Date(),
        type
    };
    setFeedbacks([newFeedback, ...feedbacks]);
  };

  const renderContent = () => {
    if (currentView === 'settings') {
        return <SettingsView courses={courses} setCourses={setCourses} users={users} setUsers={setUsers} />;
    }

    if (currentView === 'feedback') {
        return <FeedbackView feedbacks={feedbacks} onSubmit={handleFeedbackSubmit} />;
    }

    if (currentView === 'dashboard') {
        return <DashboardStats records={attendanceRecords} users={users} />;
    }
    
    if (currentView === 'analytics') {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                             <h2 className="text-3xl font-bold mb-2 flex items-center">
                                <Sparkles className="mr-3 text-yellow-300" />
                                智能考勤分析
                             </h2>
                             <p className="text-indigo-100 max-w-xl">
                                利用 Gemini AI 模型，深度分析本月的考勤数据趋势，识别潜在问题，并提供优化建议。
                             </p>
                        </div>
                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" size={18} />}
                            {isAnalyzing ? '分析中...' : '开始智能分析'}
                        </button>
                    </div>
                </div>

                {aiAnalysis && (
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm prose prose-slate max-w-none">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">AI 分析报告</h3>
                        <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                            {aiAnalysis}
                        </div>
                    </div>
                )}
                
                <DashboardStats records={attendanceRecords} users={users} />
            </div>
        )
    }

    // Default: Calendar View
    return (
        <div className="h-full">
            {calendarViewMode === 'month' ? (
                <MonthView 
                    currentDate={currentDate}
                    onDateChange={handleDateChange}
                    onDayClick={handleDayClick}
                    courses={courses}
                    records={attendanceRecords}
                />
            ) : (
                <DayView 
                    date={currentDate}
                    onBack={() => setCalendarViewMode('month')}
                    courses={courses}
                    users={users}
                    records={attendanceRecords}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
  };

  return (
    <div className={`flex min-h-screen bg-slate-50 ${isMobileMode ? 'max-w-[375px] mx-auto border-x border-slate-200 shadow-2xl overflow-hidden relative' : ''}`}>
      
      {/* Conditionally Render Sidebar based on simulation mode and screen size */}
      {!isMobileMode && (
          <Sidebar 
            currentView={currentView}
            onChangeView={(view) => {
                setCurrentView(view);
                if(view === 'calendar') setCalendarViewMode('month');
            }} 
            onScanClick={() => setShowQRScanner(true)}
          />
      )}
      
      <main className={`flex-1 p-4 md:p-8 transition-all duration-300 ${!isMobileMode ? 'md:ml-20 lg:ml-64' : 'pb-20'}`}>
        <div className="max-w-7xl mx-auto h-full relative">
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center mb-6">
                 <div className="md:hidden font-bold text-xl text-slate-800 flex items-center">
                    智考勤
                 </div>
                 
                 {/* Desktop Header Actions */}
                 <div className="hidden md:flex items-center ml-auto">
                    <button 
                        onClick={() => setIsMobileMode(!isMobileMode)}
                        className="flex items-center px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                    >
                        {isMobileMode ? <Monitor size={16} className="mr-2"/> : <Smartphone size={16} className="mr-2"/>}
                        {isMobileMode ? '退出手机视图' : '模拟手机视图'}
                    </button>
                 </div>
                 
                 {/* Mobile Header Actions */}
                 <div className="md:hidden ml-auto">
                    {/* Only show 'Exit' if in forced mobile mode via button, but since standard mobile is default css, we just use this button to toggle simulation on desktop. If on actual mobile device, css handles it. */}
                     {isMobileMode && (
                         <button onClick={() => setIsMobileMode(false)} className="text-xs bg-slate-200 px-2 py-1 rounded">退出模拟</button>
                     )}
                 </div>
            </div>

            {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Nav - Show if screen is small OR if simulation is active */}
      <div className={`${isMobileMode ? 'block' : 'md:hidden'}`}>
        <MobileNav 
            currentView={currentView}
            onChangeView={(view) => {
                setCurrentView(view);
                if(view === 'calendar') setCalendarViewMode('month');
            }}
            onScanClick={() => setShowQRScanner(true)}
        />
      </div>

      {showQRScanner && (
        <QRScanner 
            onScanSuccess={handleQRScanSuccess} 
            onClose={() => setShowQRScanner(false)} 
        />
      )}
    </div>
  );
};

export default App;
