import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AttendanceRecord } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  records: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceRecords: (state, action: PayloadAction<AttendanceRecord[]>) => {
      state.records = action.payload;
    },
    addAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const existing = state.records.find(
        r => r.userId === action.payload.userId && r.date === action.payload.date
      );
      if (!existing) {
        state.records.push(action.payload);
      } else {
        const index = state.records.findIndex(
          r => r.userId === action.payload.userId && r.date === action.payload.date
        );
        state.records[index] = action.payload;
      }
    },
    updateAttendanceRecord: (state, action: PayloadAction<AttendanceRecord>) => {
      const index = state.records.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    markUserAsVisited: (
      state,
      action: PayloadAction<{ userId: string; date: string; markedBy: 'owner' | 'user' | 'whatsapp' }>
    ) => {
      const { userId, date, markedBy } = action.payload;
      const existing = state.records.find(r => r.userId === userId && r.date === date);
      
      if (existing) {
        existing.marked = true;
        existing.markedBy = markedBy;
        existing.markedAt = new Date().toISOString();
      } else {
        state.records.push({
          id: `${userId}-${date}`,
          userId,
          date,
          marked: true,
          markedBy,
          markedAt: new Date().toISOString(),
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAttendanceRecords,
  addAttendanceRecord,
  updateAttendanceRecord,
  markUserAsVisited,
  setLoading,
  setError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
