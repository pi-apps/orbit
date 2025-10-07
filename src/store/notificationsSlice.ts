import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

interface Notification {
  id: string;
  userId: string;
  createdAt: number;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
  loading: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  lastVisible: null,
  hasMore: true,
  loading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications.push(...action.payload);
    },
    setLastVisibleNotification: (
      state,
      action: PayloadAction<QueryDocumentSnapshot<DocumentData> | null>
    ) => {
      state.lastVisible = action.payload;
    },
    setHasMoreNotifications: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setNotificationsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.lastVisible = null;
      state.hasMore = true;
      state.loading = false;
    },
  },
});

export const {
  addNotifications,
  setLastVisibleNotification,
  setHasMoreNotifications,
  setNotificationsLoading,
  clearNotifications,
} = notificationsSlice.actions;

export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;
export const selectLastVisibleNotification = (state: RootState) =>
  state.notifications.lastVisible;
export const selectHasMoreNotifications = (state: RootState) =>
  state.notifications.hasMore;
export const selectNotificationsLoading = (state: RootState) =>
  state.notifications.loading;

export default notificationsSlice.reducer;