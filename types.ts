export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  LEAVE = 'LEAVE',
  PENDING = 'PENDING'
}

export enum DayType {
  WORKDAY = 'WORKDAY',
  WEEKEND = 'WEEKEND',
  HOLIDAY = 'HOLIDAY'
}

export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  instructor: string;
  room: string;
  color: string; // Tailwind color class helper
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  courseId?: string; // Optional, if linked to a specific course
  status: AttendanceStatus;
  checkInTime?: string; // HH:mm
  notes?: string;
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  note: string;
  type: DayType;
}

export interface Feedback {
  id: string;
  userId: string; // Anonymous if empty
  content: string;
  timestamp: Date;
  type: 'bug' | 'suggestion' | 'other';
}
