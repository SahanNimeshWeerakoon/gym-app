import axios, { AxiosInstance } from 'axios';
import { User, AttendanceRecord } from '../types';

// Configure your API base URL here
const API_BASE_URL = 'https://your-api.com/api'; // Replace with your API

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

// ============ Users API ============

export const usersAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (user: Omit<User, 'id' | 'createdAt' | 'lastUpdated'>): Promise<User> => {
    const response = await apiClient.post('/users', user);
    return response.data;
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
