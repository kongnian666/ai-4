import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWeekend,
  isToday
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Course, AttendanceRecord, AttendanceStatus, DayType } from '../../types';
import { ChevronLeft, ChevronRight, Briefcase, Coffee } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
  courses: Course[];
  records: AttendanceRecord[];
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, onDateChange, onDayClick, courses, records }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { locale: zhCN });
  const endDate = endOfWeek(monthEnd, { locale: zhCN });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const prevMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayStatus = (day: Date, dayRecords: AttendanceRecord[]) => {
    if (dayRecords.length === 0) return null;
    const hasAbsent = dayRecords.some(r => r.status === AttendanceStatus.ABSENT);
    const hasLate = dayRecords.some(r => r.status === AttendanceStatus.LATE);
    
    if (hasAbsent) return 'bg-red-500';
    if (hasLate) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
          {format(currentDate, 'yyyy年 MMMM', { locale: zhCN })}
        </h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => onDateChange(new Date())} className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
            今天
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {weekDays.map((day, idx) => (
          <div key={day} className={`py-3 text-center text-sm font-semibold ${idx >= 5 ? 'text-orange-500' : 'text-slate-500'}`}>
            周{day}
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px border-b border-l border-slate-200">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const isDayWeekend = isWeekend(day);
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayRecords = records.filter(r => r.date === dateStr);
          const statusColor = getDayStatus(day, dayRecords);
          
          // Determine background color based on Work vs Rest
          let bgClass = 'bg-white';
          if (!isCurrentMonth) bgClass = 'bg-slate-50 text-slate-400';
          else if (isDayWeekend) bgClass = 'bg-orange-50/50';

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[120px] p-2 relative group cursor-pointer hover:bg-blue-50/30 transition-colors
                ${bgClass}
              `}
            >
              {/* Date Number */}
              <div className="flex justify-between items-start">
                 <span className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium
                    ${isDayToday ? 'bg-blue-600 text-white shadow-md' : isDayWeekend && isCurrentMonth ? 'text-orange-600' : 'text-slate-700'}
                  `}>
                  {format(day, 'd')}
                </span>
                {isDayWeekend && isCurrentMonth && (
                    <Coffee size={14} className="text-orange-300" />
                )}
                {!isDayWeekend && isCurrentMonth && (
                    <Briefcase size={14} className="text-slate-200 group-hover:text-blue-200" />
                )}
              </div>

              {/* Attendance Dot Indicator */}
              {isCurrentMonth && !isDayWeekend && dayRecords.length > 0 && (
                 <div className="absolute top-3 right-3 flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${statusColor || 'bg-slate-300'}`}></div>
                 </div>
              )}

              {/* Course Dots/Summary */}
              <div className="mt-2 space-y-1">
                 {isCurrentMonth && !isDayWeekend && courses.slice(0, 3).map((course, i) => (
                    <div key={i} className="flex items-center text-xs truncate text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${course.color.split(' ')[0].replace('bg-', 'bg-')}`}></span>
                        <span className="truncate">{course.title}</span>
                    </div>
                 ))}
                 {isCurrentMonth && !isDayWeekend && courses.length > 3 && (
                    <div className="text-[10px] text-slate-400 pl-3">+ {courses.length - 3} 更多</div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;