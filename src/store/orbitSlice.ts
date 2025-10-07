import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { DocumentSnapshot } from "firebase/firestore";
import { RootState } from "./store";
import eventBus from "../utils/eventBus";
import axios from "axios";

import { Timestamp } from "firebase/firestore";

import {
  Workspace,
  DashboardData,
  AnalyticsDashboardData,
  UserData,
} from "../types";

export interface UserGlobalData {
  user: User;
  userData: UserData;
  workspace?: Workspace | null;
}

interface OrbitState {
  userGlobalData: UserGlobalData | null;
  dashboardData: DashboardData | null;
  analyticsDashboardData: AnalyticsDashboardData | null;
  interactionsGrowthData: any[] | null;
}

const initialState: OrbitState = {
  userGlobalData: null,
  dashboardData: null,
  analyticsDashboardData: null,
  interactionsGrowthData: null,
};

export const DreamWorldSlice = createSlice({
  name: "orbit",
  initialState,
  reducers: {
    setUserGlobalData: (
      state,
      action: PayloadAction<UserGlobalData | null>
    ) => {
      state.userGlobalData = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserData>) => {
      if (state.userGlobalData) {
        state.userGlobalData.userData = action.payload;
      }
    },
    setDashboardData: (state, action: PayloadAction<DashboardData | null>) => {
      state.dashboardData = action.payload;
    },
    setAnalyticsDashboardData: (
      state,
      action: PayloadAction<AnalyticsDashboardData | null>
    ) => {
      state.analyticsDashboardData = action.payload;
    },
    setInteractionsGrowthData: (state, action: PayloadAction<any[] | null>) => {
      state.interactionsGrowthData = action.payload;
    },
    updateWorkspaceData: (state, action: PayloadAction<Workspace>) => {
      if (state.userGlobalData) {
        state.userGlobalData.workspace = action.payload;
      }
    },
  },
});

export const {
  setUserGlobalData,
  setUserData,
  setDashboardData,
  setAnalyticsDashboardData,
  setInteractionsGrowthData,
  updateWorkspaceData,
} = DreamWorldSlice.actions;

export const selectUserGlobalData = (state: RootState) =>
  state.orbit.userGlobalData;

export const selectDashboardData = (state: RootState) =>
  state.orbit.dashboardData;

export const selectAnalyticsDashboardData = (state: RootState) =>
  state.orbit.analyticsDashboardData;

export const selectInteractionsGrowthData = (state: RootState) =>
  state.orbit.interactionsGrowthData;

export const selectCurrentWorkspace = (state: RootState) =>
  state.orbit.userGlobalData?.workspace;

export default DreamWorldSlice.reducer;
