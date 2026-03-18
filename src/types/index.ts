// User type definition
export interface User {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
  hasWhatsApp: boolean;
  visitingDays: number[]; // 0-6 (Sunday-Saturday)
  createdAt: string;
  lastUpdated: string;
}

// Attendance record
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  marked: boolean;
  markedBy: 'owner' | 'user' | 'whatsapp'; // How it was marked
  markedAt: string;
}

// Gym Owner type
export interface GymOwner {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  gymName: string;
  createdAt: string;
}

// Stats for users
export interface UserStats {
  userId: string;
  totalScheduledDays: number;
  totalVisitedDays: number;
  visitingPercentage: number;
  lastVisitedDate: string | null;
  daysNotVisited: number;
}

// Filter type
export interface FilterCriteria {
  dateFilter?: string; // YYYY-MM-DD format
  percentageRange?: 'above90' | 'above80' | 'above50' | 'above25' | 'above10' | 'above1' | 'below1';
  searchText?: string;
}
