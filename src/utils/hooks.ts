import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setUsers, setLoading as setUsersLoading } from '../store/usersSlice';
import {
  setAttendanceRecords,
  setLoading as setAttendanceLoading,
} from '../store/attendanceSlice';
import { usersStorage, attendanceStorage, syncStorage } from './storage';
import { usersAPI, attendanceAPI } from './api';

/**
 * Hook to sync users from local storage or API
 */
export const useSyncUsers = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const syncUsers = useCallback(async (fromAPI = false) => {
    try {
      setSyncing(true);
      setError(null);

      if (fromAPI) {
        // Fetch from API
        const apiUsers = await usersAPI.getAllUsers();
        dispatch(setUsers(apiUsers));
        await usersStorage.saveUsers(apiUsers);
      } else {
        // Load from local storage
        const storedUsers = await usersStorage.getAllUsers();
        dispatch(setUsers(storedUsers));
      }

      await syncStorage.updateLastSyncTime();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sync users';
      setError(errorMessage);
      console.error('Error syncing users:', err);
    } finally {
      setSyncing(false);
    }
  }, [dispatch]);

  return { syncUsers, error, syncing };
};

/**
 * Hook to sync attendance records from local storage or API
 */
export const useSyncAttendance = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const syncAttendance = useCallback(async (fromAPI = false) => {
    try {
      setSyncing(true);
      setError(null);

      if (fromAPI) {
        // Fetch from API
        const apiRecords = await attendanceAPI.getAttendanceRecords();
        dispatch(setAttendanceRecords(apiRecords));
        await attendanceStorage.saveRecords(apiRecords);
      } else {
        // Load from local storage
        const storedRecords = await attendanceStorage.getAllRecords();
        dispatch(setAttendanceRecords(storedRecords));
      }

      await syncStorage.updateLastSyncTime();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sync attendance';
      setError(errorMessage);
      console.error('Error syncing attendance:', err);
    } finally {
      setSyncing(false);
    }
  }, [dispatch]);

  return { syncAttendance, error, syncing };
};

/**
 * Hook to sync all data (users and attendance)
 */
export const useSyncAllData = () => {
  const { syncUsers } = useSyncUsers();
  const { syncAttendance } = useSyncAttendance();
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const syncAll = useCallback(async (fromAPI = false) => {
    try {
      setSyncing(true);
      setError(null);

      await Promise.all([
        syncUsers(fromAPI),
        syncAttendance(fromAPI),
      ]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sync data';
      setError(errorMessage);
      console.error('Error syncing all data:', err);
    } finally {
      setSyncing(false);
    }
  }, [syncUsers, syncAttendance]);

  return { syncAll, error, syncing };
};

/**
 * Hook to pull-to-refresh data
 */
export const usePullToRefresh = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { syncAll } = useSyncAllData();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await syncAll(false); // Load from local storage with option to sync from API
    } finally {
      setRefreshing(false);
    }
  }, [syncAll]);

  return { refreshing, onRefresh };
};

/**
 * Hook to get user statistics
 */
export const useUserStats = (userId: string) => {
  const users = useSelector((state: RootState) => state.users.users);
  const attendance = useSelector((state: RootState) => state.attendance.records);
  const user = users.find(u => u.id === userId);

  const userAttendance = attendance.filter(r => r.userId === userId);

  return {
    user,
    records: userAttendance,
    totalRecords: userAttendance.length,
  };
};

/**
 * Hook for debounced search
 */
export const useDebouncedSearch = (searchTerm: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return debouncedValue;
};
