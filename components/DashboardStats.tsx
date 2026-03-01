import React from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, UserCheck, UserX, Clock, Coffee } from 'lucide-react';

interface DashboardStatsProps {
  records: AttendanceRecord[];
  users: User[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ records, users }) => {
  // Calculate totals
  const totalChecks = records.length;
  const presentCount = records.filter(r => r.status === AttendanceStatus.PRESENT).length;
  const lateCount = records.filter(r => r.status === AttendanceStatus.LATE).length;
  const absentCount = records.filter(r => r.status === AttendanceStatus.ABSENT).length;
  const leaveCount = records.filter(r => r.status === AttendanceStatus.LEAVE).length;

  const attendanceRate = totalChecks > 0 ? Math.round((presentCount / totalChecks) * 100) : 0;

  const pieData = [
    { name: '正常', value: presentCount, color: '#10b981' }, // emerald-500
    { name: '迟到', value: lateCount, color: '#f59e0b' },    // amber-500
    { name: '缺勤', value: absentCount, color: '#ef4444' },  // red-500
    { name: '请假', value: leaveCount, color: '#6366f1' },   // indigo-500
  ].filter(d => d.value > 0);

  // Mock bar data for last 7 days (simplified logic for demo)
  const barData = [
    { name: '周一', 正常: 15, 迟到: 2, 缺勤: 1, 请假: 1 },
    { name: '周二', 正常: 16, 迟到: 1, 缺勤: 1, 请假: 0 },
    { name: '周三', 正常: 14, 迟到: 4, 缺勤: 0, 请假: 2 },
    { name: '周四', 正常: 17, 迟到: 1, 缺勤: 0, 请假: 0 },
    { name: '周五', 正常: 12, 迟到: 2, 缺勤: 4, 请假: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mb-2 md:mb-0">
                <Users size={20} />
            </div>
            <div className="md:ml-3">
                <p className="text-xs text-slate-500">总人数</p>
                <p className="text-xl font-bold text-slate-800">{users.length}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 mb-2 md:mb-0">
                <UserCheck size={20} />
            </div>
            <div className="md:ml-3">
                <p className="text-xs text-slate-500">正常</p>
                <p className="text-xl font-bold text-emerald-600">{presentCount}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left">
            <div className="p-3 rounded-lg bg-amber-50 text-amber-600 mb-2 md:mb-0">
                <Clock size={20} />
            </div>
            <div className="md:ml-3">
                <p className="text-xs text-slate-500">迟到</p>
                <p className="text-xl font-bold text-amber-600">{lateCount}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left">
            <div className="p-3 rounded-lg bg-red-50 text-red-600 mb-2 md:mb-0">
                <UserX size={20} />
            </div>
            <div className="md:ml-3">
                <p className="text-xs text-slate-500">缺勤</p>
                <p className="text-xl font-bold text-red-600">{absentCount}</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center text-center md:text-left col-span-2 md:col-span-1">
            <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 mb-2 md:mb-0">
                <Coffee size={20} />
            </div>
            <div className="md:ml-3">
                <p className="text-xs text-slate-500">请假</p>
                <p className="text-xl font-bold text-indigo-600">{leaveCount}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">出勤状态分布</h3>
            <div className="h-64 w-full flex items-center justify-center">
                {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-slate-400">暂无数据</p>
                )}
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-4">
                {pieData.map(item => (
                    <div key={item.name} className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">{item.name} ({item.value})</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">本周趋势 (示例)</h3>
            <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tick={{fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="正常" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} barSize={32} />
                        <Bar dataKey="迟到" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="缺勤" stackId="a" fill="#ef4444" />
                        <Bar dataKey="请假" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
