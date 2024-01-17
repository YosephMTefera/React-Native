import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  category: "65859d27f8e02b0d9d69624f",
};

const postSlice = createSlice({
  name: "Post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const postAction = postSlice.actions;

export default postSlice;
