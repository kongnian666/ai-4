import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Course, User, AttendanceRecord, AttendanceStatus } from '../../types';
import { Clock, MapPin, CheckCircle, XCircle, AlertCircle, Coffee } from 'lucide-react';

interface DayViewProps {
  date: Date;
  onBack: () => void;
  courses: Course[];
  users: User[];
  records: AttendanceRecord[];
  onUpdateStatus: (userId: string, courseId: string | undefined, status: AttendanceStatus) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, onBack, courses, users, records, onUpdateStatus }) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const isWeekendDay = date.getDay() === 0 || date.getDay() === 6;

  // Filter records for this day
  const dayRecords = records.filter(r => r.date === dateStr);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 mb-1 flex items-center">
             ← 返回月历
          </button>
          <h2 className="text-2xl font-bold text-slate-800">
            {format(date, 'yyyy年 MMMM d日', { locale: zhCN })}
            <span className={`ml-3 text-lg font-normal ${isWeekendDay ? 'text-orange-500' : 'text-slate-500'}`}>
                {format(date, 'EEEE', { locale: zhCN })}
                {isWeekendDay ? ' (休息日)' : ' (工作日)'}
            </span>
          </h2>
        </div>
        <div className="text-right">
             <p className="text-sm text-slate-500">今日课程</p>
             <p className="text-xl font-bold text-slate-800">{isWeekendDay ? 0 : courses.length} 节</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
        {isWeekendDay ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">☕</span>
                </div>
                <p className="text-lg">今天是休息日，好好放松一下吧！</p>
            </div>
        ) : (
            <div className="space-y-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Course Header */}
                        <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${course.color.replace('text-', 'bg-opacity-10 bg-')}`}>
                            <div className="flex items-center space-x-4">
                                <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${course.color}`}>
                                    {course.startTime} - {course.endTime}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{course.title}</h3>
                                    <div className="flex items-center text-xs text-slate-500 mt-1 space-x-3">
                                        <span className="flex items-center"><MapPin size={12} className="mr-1"/> {course.room}</span>
                                        <span className="flex items-center"><Clock size={12} className="mr-1"/> {course.instructor}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-400">
                                45分钟
                            </div>
                        </div>

                        {/* Student List & Attendance */}
                        <div className="p-4 bg-white">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">学生考勤 ({users.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {users.map(user => {
                                    // Find existing record
                                    const record = dayRecords.find(r => r.userId === user.id) || { status: AttendanceStatus.PENDING };

                                    return (
                                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center">
                                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                                <span className="ml-3 text-sm font-medium text-slate-700">{user.name}</span>
                                            </div>
                                            <div className="flex space-x-1">
                                                <button 
                                                    onClick={() => onUpdateStatus(user.id, course.id, AttendanceStatus.PRESENT)}
                                                    className={`p-1.5 rounded-md hover:bg-emerald-50 transition-colors ${record.status === AttendanceStatus.PRESENT ? 'text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200' : 'text-slate-300'}`}
                                                    title="正常"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => onUpdateStatus(user.id, course.id, AttendanceStatus.LATE)}
                                                    className={`p-1.5 rounded-md hover:bg-amber-50 transition-colors ${record.status === AttendanceStatus.LATE ? 'text-amber-600 bg-amber-50 ring-1 ring-amber-200' : 'text-slate-300'}`}
                                                    title="迟到"
                                                >
                                                    <AlertCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => onUpdateStatus(user.id, course.id, AttendanceStatus.ABSENT)}
                                                    className={`p-1.5 rounded-md hover:bg-red-50 transition-colors ${record.status === AttendanceStatus.ABSENT ? 'text-red-600 bg-red-50 ring-1 ring-red-200' : 'text-slate-300'}`}
                                                    title="缺勤"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => onUpdateStatus(user.id, course.id, AttendanceStatus.LEAVE)}
                                                    className={`p-1.5 rounded-md hover:bg-indigo-50 transition-colors ${record.status === AttendanceStatus.LEAVE ? 'text-indigo-600 bg-indigo-50 ring-1 ring-indigo-200' : 'text-slate-300'}`}
                                                    title="请假"
                                                >
                                                    <Coffee size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DayView;
