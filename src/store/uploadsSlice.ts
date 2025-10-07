import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { RootState } from "./store";

interface Media {
  id: string;
  url: string;
  name: string;
  [key: string]: any;
}

interface UploadsState {
  media: Media[];
  lastVisible: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

const initialState: UploadsState = {
  media: [],
  lastVisible: null,
  hasMore: true,
};

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    addMedia: (state, action: PayloadAction<Media[]>) => {
      const newMedia = action.payload.filter(
        (newItem) => !state.media.some((item) => item.id === newItem.id)
      );
      state.media = [...state.media, ...newMedia];
    },
    setLastVisibleMedia: (
      state,
      action: PayloadAction<QueryDocumentSnapshot | null>
    ) => {
      state.lastVisible = action.payload;
    },
    setHasMoreMedia: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    clearMedia: (state) => {
      state.media = [];
      state.lastVisible = null;
      state.hasMore = true;
    },
  },
});

export const { addMedia, setLastVisibleMedia, setHasMoreMedia, clearMedia } =
  uploadsSlice.actions;

export const selectMedia = (state: RootState) => state.uploads.media;
export const selectLastVisibleMedia = (state: RootState) =>
  state.uploads.lastVisible;
export const selectHasMoreMedia = (state: RootState) => state.uploads.hasMore;

export default uploadsSlice.reducer;
