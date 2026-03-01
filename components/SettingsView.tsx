import React, { useState } from 'react';
import { Course, User } from '../types';
import { BookOpen, Users, Plus, Trash2, Save, X } from 'lucide-react';

interface SettingsViewProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ courses, setCourses, users, setUsers }) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');
  
  // -- Course State --
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '', startTime: '09:00', endTime: '10:00', instructor: '', room: '', color: 'bg-blue-100 text-blue-700 border-blue-200'
  });

  // -- User State --
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  // Course Handlers
  const handleAddCourse = () => {
    if (!newCourse.title || !newCourse.instructor) return;
    const id = `c-${Date.now()}`;
    setCourses([...courses, { ...newCourse, id } as Course]);
    setIsAddingCourse(false);
    setNewCourse({ title: '', startTime: '09:00', endTime: '10:00', instructor: '', room: '', color: 'bg-blue-100 text-blue-700 border-blue-200' });
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  // User Handlers
  const handleAddUser = () => {
    if (!newUserName.trim()) return;
    const id = `u-${Date.now()}`;
    const avatar = `https://picsum.photos/seed/${id}/40/40`;
    setUsers([...users, { id, name: newUserName, role: 'student', avatar }]);
    setNewUserName('');
    setNewUserOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const colorOptions = [
    { label: 'Blue', value: 'bg-blue-100 text-blue-700 border-blue-200' },
    { label: 'Emerald', value: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { label: 'Indigo', value: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { label: 'Amber', value: 'bg-amber-100 text-amber-700 border-amber-200' },
    { label: 'Rose', value: 'bg-rose-100 text-rose-700 border-rose-200' },
    { label: 'Purple', value: 'bg-purple-100 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">系统设置</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'courses' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <div className="flex items-center"><BookOpen size={16} className="mr-2"/> 课程管理</div>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
             <div className="flex items-center"><Users size={16} className="mr-2"/> 人员管理</div>
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
            {activeTab === 'courses' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-slate-500 text-sm">管理每日的课程安排、时间及教室信息。</p>
                        <button onClick={() => setIsAddingCourse(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium">
                            <Plus size={16} className="mr-1" /> 添加课程
                        </button>
                    </div>

                    {/* Add Course Form */}
                    {isAddingCourse && (
                        <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top-2">
                             <h4 className="font-semibold text-slate-700 mb-3">新课程信息</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    placeholder="课程名称 (如: 高等数学)" 
                                    className="p-2 border rounded-lg"
                                    value={newCourse.title}
                                    onChange={e => setNewCourse({...newCourse, title: e.target.value})}
                                />
                                <input 
                                    placeholder="授课教师" 
                                    className="p-2 border rounded-lg"
                                    value={newCourse.instructor}
                                    onChange={e => setNewCourse({...newCourse, instructor: e.target.value})}
                                />
                                <div className="flex gap-2">
                                    <input 
                                        type="time"
                                        className="p-2 border rounded-lg flex-1"
                                        value={newCourse.startTime}
                                        onChange={e => setNewCourse({...newCourse, startTime: e.target.value})}
                                    />
                                    <span className="self-center text-slate-400">-</span>
                                    <input 
                                        type="time"
                                        className="p-2 border rounded-lg flex-1"
                                        value={newCourse.endTime}
                                        onChange={e => setNewCourse({...newCourse, endTime: e.target.value})}
                                    />
                                </div>
                                <input 
                                    placeholder="教室 (如: A101)" 
                                    className="p-2 border rounded-lg"
                                    value={newCourse.room}
                                    onChange={e => setNewCourse({...newCourse, room: e.target.value})}
                                />
                                <div className="md:col-span-2">
                                    <label className="text-xs text-slate-500 block mb-1">标签颜色</label>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {colorOptions.map(opt => (
                                            <button 
                                                key={opt.label}
                                                onClick={() => setNewCourse({...newCourse, color: opt.value})}
                                                className={`w-8 h-8 rounded-full border-2 ${opt.value.replace('text-', 'bg-').split(' ')[0]} ${newCourse.color === opt.value ? 'border-slate-600 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                title={opt.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                             </div>
                             <div className="flex justify-end mt-4 gap-2">
                                <button onClick={() => setIsAddingCourse(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded-lg">取消</button>
                                <button onClick={handleAddCourse} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">保存课程</button>
                             </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map(course => (
                            <div key={course.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow relative group bg-white">
                                <button onClick={() => handleDeleteCourse(course.id)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                </button>
                                <div className="flex items-center mb-2">
                                    <div className={`w-2 h-8 rounded-full mr-3 ${course.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{course.title}</h3>
                                        <p className="text-xs text-slate-500">{course.startTime} - {course.endTime}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mt-2 space-y-1 pl-5">
                                    <p className="flex items-center"><Users size={14} className="mr-2 opacity-50"/> {course.instructor}</p>
                                    <p className="flex items-center"><BookOpen size={14} className="mr-2 opacity-50"/> {course.room}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {courses.length === 0 && <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">暂无课程，请点击添加。</div>}
                </div>
            )}

            {activeTab === 'users' && (
                <div className="space-y-4">
                     <div className="flex justify-between items-center mb-4">
                        <p className="text-slate-500 text-sm">管理需要进行考勤的学生或员工名单。</p>
                        <button onClick={() => setNewUserOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm font-medium">
                            <Plus size={16} className="mr-1" /> 添加人员
                        </button>
                    </div>

                    {newUserOpen && (
                        <div className="flex items-center gap-2 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <input 
                                autoFocus
                                placeholder="输入姓名"
                                className="flex-1 p-2 border rounded-lg"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
                            />
                            <button onClick={() => setNewUserOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                            <button onClick={handleAddUser} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center">
                                <Save size={16} className="mr-1"/> 保存
                            </button>
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">人员</th>
                                    <th className="px-6 py-3 font-medium">角色</th>
                                    <th className="px-6 py-3 font-medium text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <img src={user.avatar} className="w-8 h-8 rounded-full mr-3" alt={user.name} />
                                                <span className="font-medium text-slate-700">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs">学生</span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.length === 0 && <div className="text-center py-8 text-slate-400">暂无人员。</div>}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
