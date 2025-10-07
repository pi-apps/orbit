import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DraftCompleteData, ScheduledPostCompleteData } from "../types";
import { RootState } from "./store";
import { QueryDocumentSnapshot } from "firebase/firestore";

interface CreatePageState {
  drafts: DraftCompleteData[];
  scheduledPosts: ScheduledPostCompleteData[];
  lastVisibleDraft: QueryDocumentSnapshot | null;
  lastVisibleScheduledPost: QueryDocumentSnapshot | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreatePageState = {
  drafts: [],
  scheduledPosts: [],
  lastVisibleDraft: null,
  lastVisibleScheduledPost: null,
  loading: false,
  error: null,
};

const createPageSlice = createSlice({
  name: "createPage",
  initialState,
  reducers: {
    addDrafts: (state, action: PayloadAction<DraftCompleteData[]>) => {
      state.drafts.push(...action.payload);
    },
    setLastVisibleDraft: (
      state,
      action: PayloadAction<QueryDocumentSnapshot | null>
    ) => {
      state.lastVisibleDraft = action.payload;
    },
    addScheduledPosts: (
      state,
      action: PayloadAction<ScheduledPostCompleteData[]>
    ) => {
      state.scheduledPosts.push(...action.payload);
    },
    setLastVisibleScheduledPost: (
      state,
      action: PayloadAction<QueryDocumentSnapshot | null>
    ) => {
      state.lastVisibleScheduledPost = action.payload;
    },
    addDraft: (state, action: PayloadAction<DraftCompleteData>) => {
      state.drafts.unshift(action.payload);
    },
    updateDraft: (state, action: PayloadAction<DraftCompleteData>) => {
      const index = state.drafts.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state.drafts[index] = action.payload;
      }
    },
    deleteDraft: (state, action: PayloadAction<string>) => {
      state.drafts = state.drafts.filter((d) => d.id !== action.payload);
    },
    addScheduledPost: (
      state,
      action: PayloadAction<ScheduledPostCompleteData>
    ) => {
      state.scheduledPosts.unshift(action.payload);
    },
    deleteScheduledPost: (state, action: PayloadAction<string>) => {
      state.scheduledPosts = state.scheduledPosts.filter(
        (p) => p.id !== action.payload
      );
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
  addDrafts,
  setLastVisibleDraft,
  addScheduledPosts,
  setLastVisibleScheduledPost,
  addDraft,
  updateDraft,
  deleteDraft,
  addScheduledPost,
  deleteScheduledPost,
  setLoading,
  setError,
} = createPageSlice.actions;

export const selectCreatePage = (state: RootState) => state.createPage;

export default createPageSlice.reducer;
