import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  USERS: '@gym_app_users',
  ATTENDANCE: '@gym_app_attendance',
  OWNER: '@gym_app_owner',
  LAST_SYNC: '@gym_app_last_sync',
  AUTH_TOKEN: '@gym_app_auth_token',
};

// ============ Users Storage ============

export const usersStorage = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading users from storage:', error);
      return [];
    }
  },

  saveUsers: async (users: User[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  },

  addUser: async (user: User): Promise<void> => {
    try {
      const users = await usersStorage.getAllUsers();
      users.push(user);
      await usersStorage.saveUsers(users);
    } catch (error) {
      console.error('Error adding user to storage:', error);
    }
  },

  updateUser: async (user: User): Promise<void> => {
    try {
      const users = await usersStorage.getAllUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        await usersStorage.saveUsers(users);
      }
    } catch (error) {
      console.error('Error updating user in storage:', error);
    }
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      const users = await usersStorage.getAllUsers();
      const filtered = users.filter(u => u.id !== userId);
      await usersStorage.saveUsers(filtered);
    } catch (error) {
      console.error('Error deleting user from storage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USERS);
    } catch (error) {
      console.error('Error clearing users storage:', error);
    }
  },
};

// ============ Attendance Storage ============

export const attendanceStorage = {
  getAllRecords: async (): Promise<AttendanceRecord[]> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading attendance from storage:', error);
      return [];
    }
  },

  saveRecords: async (records: AttendanceRecord[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving attendance to storage:', error);
    }
  },

  addRecord: async (record: AttendanceRecord): Promise<void> => {
    try {
      const records = await attendanceStorage.getAllRecords();
      records.push(record);
      await attendanceStorage.saveRecords(records);
    } catch (error) {
      console.error('Error adding attendance record to storage:', error);
    }
  },

  updateRecord: async (record: AttendanceRecord): Promise<void> => {
    try {
      const records = await attendanceStorage.getAllRecords();
      const index = records.findIndex(r => r.id === record.id);
      if (index !== -1) {
        records[index] = record;
        await attendanceStorage.saveRecords(records);
      }
    } catch (error) {
      console.error('Error updating attendance record in storage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    } catch (error) {
      console.error('Error clearing attendance storage:', error);
    }
  },
};

// ============ Owner Storage ============

export const ownerStorage = {
  getOwner: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.OWNER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading owner from storage:', error);
      return null;
    }
  },

  saveOwner: async (owner: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OWNER, JSON.stringify(owner));
    } catch (error) {
      console.error('Error saving owner to storage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OWNER);
    } catch (error) {
      console.error('Error clearing owner storage:', error);
    }
  },
};

// ============ Auth Token Storage ============

export const authStorage = {
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error('Error saving token to storage:', error);
    }
  },

  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  },
};

// ============ Sync Time Storage ============

export const syncStorage = {
  getLastSyncTime: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    } catch (error) {
      console.error('Error reading last sync time:', error);
      return null;
    }
  },

  updateLastSyncTime: async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last sync time:', error);
    }
  },
};
