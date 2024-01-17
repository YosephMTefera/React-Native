import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryList: [],
};

const categorySlice = createSlice({
  name: "Category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.categoryList = action.payload.categoryList;
    },
  },
});

export const categoryAction = categorySlice.actions;

export default categorySlice;
