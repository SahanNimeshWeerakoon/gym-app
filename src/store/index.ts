import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import attendanceReducer from './attendanceSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    attendance: attendanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
