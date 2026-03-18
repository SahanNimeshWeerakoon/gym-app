import { User, AttendanceRecord, UserStats } from '../types';
import { format, parse, differenceInDays, isAfter, isBefore, isEqual } from 'date-fns';

/**
 * Calculate user visiting statistics
 */
export const calculateUserStats = (
  user: User,
  attendanceRecords: AttendanceRecord[],
  fromDate?: string,
  toDate?: string
): UserStats => {
  const today = new Date();
  const start = fromDate ? parse(fromDate, 'yyyy-MM-dd', new Date()) : new Date(today.getFullYear(), 0, 1);
  const end = toDate ? parse(toDate, 'yyyy-MM-dd', new Date()) : today;

  // Count scheduled and visited days
  let totalScheduledDays = 0;
  let totalVisitedDays = 0;
  let lastVisitedDate: string | null = null;

  const currentDate = new Date(start);
  while (isBefore(currentDate, end) || isEqual(currentDate, end)) {
    const dayOfWeek = currentDate.getDay();
    const dateStr = format(currentDate, 'yyyy-MM-dd');

    // Check if user should visit on this day
    if (user.visitingDays.includes(dayOfWeek)) {
      totalScheduledDays++;

      // Check if attended
      const record = attendanceRecords.find(
        r => r.userId === user.id && r.date === dateStr && r.marked
      );
      if (record) {
        totalVisitedDays++;
        lastVisitedDate = record.date;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const visitingPercentage = totalScheduledDays > 0 ? (totalVisitedDays / totalScheduledDays) * 100 : 0;

  // Calculate days not visited for scheduled days
  let daysNotVisited = 0;
  const checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() - 3);

  const checkEndDate = new Date(today);
  while (isBefore(checkDate, checkEndDate) || isEqual(checkDate, checkEndDate)) {
    const dayOfWeek = checkDate.getDay();
    const dateStr = format(checkDate, 'yyyy-MM-dd');

    if (user.visitingDays.includes(dayOfWeek)) {
      const wasVisited = attendanceRecords.some(
        r => r.userId === user.id && r.date === dateStr && r.marked
      );
      if (!wasVisited) {
        daysNotVisited++;
      }
    }

    checkDate.setDate(checkDate.getDate() + 1);
  }

  return {
    userId: user.id,
    totalScheduledDays,
    totalVisitedDays,
    visitingPercentage: parseFloat(visitingPercentage.toFixed(2)),
    lastVisitedDate,
    daysNotVisited,
  };
};

/**
 * Filter users by visiting percentage
 */
export const filterByPercentage = (stats: UserStats[], range: string): UserStats[] => {
  return stats.filter(stat => {
    const percentage = stat.visitingPercentage;
    switch (range) {
      case 'above90':
        return percentage >= 90;
      case 'above80':
        return percentage >= 80;
      case 'above50':
        return percentage >= 50;
      case 'above25':
        return percentage >= 25;
      case 'above10':
        return percentage >= 10;
      case 'above1':
        return percentage >= 1;
      case 'below1':
        return percentage < 1;
      default:
        return true;
    }
  });
};

/**
 * Get users who should visit on a specific date
 */
export const getUsersForDate = (
  users: User[],
  date: string,
  attendanceRecords: AttendanceRecord[]
): { user: User; attended: boolean }[] => {
  const selectedDate = parse(date, 'yyyy-MM-dd', new Date());
  const dayOfWeek = selectedDate.getDay();
  const isToday = format(new Date(), 'yyyy-MM-dd') === date;
  const isFutureDate = isAfter(selectedDate, new Date());

  return users
    .filter(user => user.visitingDays.includes(dayOfWeek))
    .map(user => {
      const record = attendanceRecords.find(r => r.userId === user.id && r.date === date);
      const attended = record?.marked || false;
      return { user, attended };
    });
};

/**
 * Get percentage range label
 */
export const getPercentageLabel = (percentage: number): string => {
  if (percentage >= 90) return '90%+ Attendance';
  if (percentage >= 80) return '80%+ Attendance';
  if (percentage >= 50) return '50%+ Attendance';
  if (percentage >= 25) return '25%+ Attendance';
  if (percentage >= 10) return '10%+ Attendance';
  if (percentage >= 1) return '1%+ Attendance';
  return 'Below 1% Attendance';
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateStr: string): string => {
  const date = parse(dateStr, 'yyyy-MM-dd', new Date());
  return format(date, 'EEE, MMM dd, yyyy');
};

/**
 * Get day name from number
 */
export const getDayName = (dayOfWeek: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
};

/**
 * Check if user should be reminded about visit
 */
export const shouldSendReminder = (user: User, date: string): boolean => {
  const selectedDate = parse(date, 'yyyy-MM-dd', new Date());
  const dayOfWeek = selectedDate.getDay();
  return user.visitingDays.includes(dayOfWeek);
};
