// Days of week
export const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Filter ranges
export const PERCENTAGE_RANGES = {
  above90: { label: '90% - 100%', min: 90 },
  above80: { label: '80% - 100%', min: 80 },
  above50: { label: '50% - 100%', min: 50 },
  above25: { label: '25% - 100%', min: 25 },
  above10: { label: '10% - 100%', min: 10 },
  above1: { label: '1% - 100%', min: 1 },
  below1: { label: 'Below 1%', min: 0, max: 1 },
};

// Genders
export const GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

// Colors
export const COLORS = {
  primary: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  light: '#f5f5f5',
  dark: '#212121',
};

// Attendance thresholds
export const ATTENDANCE_THRESHOLDS = {
  excellent: 90,
  good: 80,
  fair: 50,
  poor: 25,
  critical: 10,
};

// Message templates (for future WhatsApp integration)
export const MESSAGE_TEMPLATES = {
  missedVisit: `Hello! We noticed you missed your scheduled gym visit today. Would you like to mark yourself as visited or reschedule? Reply with YES to confirm visit.`,
  threeDay: `Hi! You've missed gym visits for the last 3 scheduled days. Would you like to reschedule your visiting days? Reply with new days (e.g., MON,WED,FRI).`,
  reminder: `Don't forget! You have a scheduled gym visit today. Come by and keep up that amazing consistency!`,
};

// API timeout
export const API_TIMEOUT = 10000;

// Storage keys
export const STORAGE_KEYS = {
  USERS: '@gym_app_users',
  ATTENDANCE: '@gym_app_attendance',
  OWNER: '@gym_app_owner',
  LAST_SYNC: '@gym_app_last_sync',
  AUTH_TOKEN: '@gym_app_auth_token',
};
