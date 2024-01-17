import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "./categorySlice";
import postSlice from "./postSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    posts: postSlice.reducer,
    category: categorySlice.reducer,
    user: userSlice.reducer,
  },
});
