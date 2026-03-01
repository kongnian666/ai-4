import { User, Course, AttendanceStatus, AttendanceRecord } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: '张伟', role: 'student', avatar: 'https://picsum.photos/seed/u1/40/40' },
  { id: 'u2', name: '李娜', role: 'student', avatar: 'https://picsum.photos/seed/u2/40/40' },
  { id: 'u3', name: '王强', role: 'student', avatar: 'https://picsum.photos/seed/u3/40/40' },
  { id: 'u4', name: '赵敏', role: 'student', avatar: 'https://picsum.photos/seed/u4/40/40' },
];

export const MOCK_COURSES: Course[] = [
  { 
    id: 'c1', 
    title: '高等数学', 
    startTime: '09:00', 
    endTime: '10:30', 
    instructor: '刘教授', 
    room: 'A101', 
    color: 'bg-blue-100 text-blue-700 border-blue-200' 
  },
  { 
    id: 'c2', 
    title: '英语口语', 
    startTime: '13:00', 
    endTime: '14:30', 
    instructor: 'Smith', 
    room: 'B203', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' 
  },
  { 
    id: 'c3', 
    title: '计算机科学导论', 
    startTime: '15:00', 
    endTime: '17:00', 
    instructor: '陈博士', 
    room: 'C305', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200' 
  },
];

// Helper to generate some initial attendance records for the current month
export const GENERATE_INITIAL_RECORDS = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Create records for the first 10 days of the current month
  for (let d = 1; d <= 10; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, d).getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Weekdays only
      MOCK_USERS.forEach(user => {
        // Randomly assign status
        const rand = Math.random();
        let status = AttendanceStatus.PRESENT;
        if (rand > 0.9) status = AttendanceStatus.ABSENT;
        else if (rand > 0.8) status = AttendanceStatus.LATE;

        records.push({
          id: `att-${dateStr}-${user.id}`,
          userId: user.id,
          date: dateStr,
          status,
          checkInTime: status === AttendanceStatus.ABSENT ? undefined : '08:55',
        });
      });
    }
  }
  return records;
};
