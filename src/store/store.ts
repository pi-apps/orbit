
import { configureStore } from '@reduxjs/toolkit';
import dreamworldReducer from './orbitSlice';
import calendarReducer from './calendarSlice';
import createPageReducer from './createPageSlice';
import uploadsReducer from './uploadsSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    orbit: dreamworldReducer,
    calendar: calendarReducer,
    createPage: createPageReducer,
    uploads: uploadsReducer,
    notifications: notificationsReducer,
  },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
