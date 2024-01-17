import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  editField: "",
};

const userSlice = createSlice({
  name: "EditFiled",
  initialState,
  reducers: {
    setEditFiled: (state, action) => {
      state.editField = action.payload;
    },
  },
});

export const userAction = userSlice.actions;

export default userSlice;
