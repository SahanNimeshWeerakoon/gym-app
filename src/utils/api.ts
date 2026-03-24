import axios, { AxiosInstance } from 'axios';
import { User, AttendanceRecord } from '../types';

// Configure your API base URL here
const API_BASE_URL = 'http://localhost:3000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests if available
apiClient.interceptors.request.use(async config => {
  // Add auth token if available
  // const token = await AsyncStorage.getItem('authToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// CreateUserDto interface for API compatibility
interface CreateUserDto {
  name: string;
  gender: string;
  phoneNumber: string;
  address: string;
  isWhatsappAvailable: boolean;
  visitDays: string[];
}

// Normalize API user payload to app User model
const normalizeUser = (raw: any): User => {
  const visitingDaysRaw = raw.visitingDays ?? raw.visitDays ?? [];
  const visitingDays = Array.isArray(visitingDaysRaw)
    ? visitingDaysRaw.map((day: number | string) => Number(day)).filter((d: number) => !isNaN(d))
    : [];

  return {
    id: raw.id ?? raw._id ?? '',
    name: raw.name ?? '',
    gender: raw.gender ?? 'other',
    phoneNumber: raw.phoneNumber ?? raw.phone ?? '',
    address: raw.address ?? '',
    hasWhatsApp: raw.hasWhatsApp ?? raw.isWhatsappAvailable ?? false,
    visitingDays,
    imageUri: raw.imageUri ?? raw.image ?? undefined,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    lastUpdated: raw.lastUpdated ?? new Date().toISOString(),
  };
};

// ============ Users API ============

export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    console.log('API response.data:', response.data);

    let rawUsers: any[] = [];
    if (Array.isArray(response.data)) {
      rawUsers = response.data;
    } else if (response.data?.users && Array.isArray(response.data.users)) {
      rawUsers = response.data.users;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      rawUsers = response.data.data;
    }

    const users = rawUsers.map(normalizeUser);
    console.log('Normalized users:', users);
    return users;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return normalizeUser(response.data);
  },

  createUser: async (user: CreateUserDto | Omit<User, 'id' | 'createdAt' | 'lastUpdated'>): Promise<User> => {
    const response = await apiClient.post('/users', user);
    return normalizeUser(response.data);
  },

  updateUser: async (userId: string, user: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/users/${userId}`, user);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}`);
  },
};

// ============ Attendance API ============

export const attendanceAPI = {
  getAttendanceRecords: async (
    filters?: { userId?: string; dateFrom?: string; dateTo?: string }
  ): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/attendance', { params: filters });
    return response.data;
  },

  getAttendanceForUser: async (userId: string): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get(`/attendance/user/${userId}`);
    return response.data;
  },

  getAttendanceForDate: async (date: string): Promise<AttendanceRecord[]> => {
    const response = await apiClient.get('/attendance/date', { params: { date } });
    return response.data;
  },

  markUserVisited: async (
    userId: string,
    date: string,
    markedBy: 'owner' | 'user' | 'whatsapp'
  ): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/attendance/mark', {
      userId,
      date,
      markedBy,
    });
    return response.data;
  },

  createAttendanceRecord: async (record: Omit<AttendanceRecord, 'id' | 'markedAt'>): Promise<AttendanceRecord> => {
    const response = await apiClient.post('/attendance', record);
    return response.data;
  },

  deleteAttendanceRecord: async (recordId: string): Promise<void> => {
    await apiClient.delete(`/attendance/${recordId}`);
  },
};

// ============ Health Check ============

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default apiClient;
