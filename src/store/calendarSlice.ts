import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PostData } from "../types";



interface Campaign {
  id: string;
  name: string;
  color: string;
}

interface CalendarState {
  posts: { [key: string]: PostData };
  postIds: string[];
  campaigns: Campaign[];
  nextCursor: string | null;
}

const initialState: CalendarState = {
  posts: {},
  postIds: [],
  campaigns: [], // We can populate this later if needed
  nextCursor: null,
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostData[]>) => {
      state.posts = {};
      state.postIds = [];
      action.payload.forEach((post) => {
        state.posts[post.id] = post;
        state.postIds.push(post.id);
      });
    },
    addPosts: (state, action: PayloadAction<PostData[]>) => {
      action.payload.forEach((post) => {
        if (!state.posts[post.id]) {
          state.posts[post.id] = post;
          state.postIds.push(post.id);
        }
      });
    },
    setNextCursor: (state, action: PayloadAction<string | null>) => {
      state.nextCursor = action.payload;
    },
    clearCalendarState: (state) => {
      state.posts = {};
      state.postIds = [];
      state.nextCursor = null;
    },
  },
});

export const { setPosts, addPosts, setNextCursor, clearCalendarState } =
  calendarSlice.actions;

export default calendarSlice.reducer;
