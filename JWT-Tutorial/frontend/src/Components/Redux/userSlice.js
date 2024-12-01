import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  message: "",
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getUserStart: (state) => {
      state.users.isFetching = true;
    },
    getUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.users.currentUser = action.payload;
      state.users.error = false;
    },
    getUserFailed: (state) => {
      state.users.isFetching = false;
      state.users.error = true;
    },

    // DELETE
    deleteUserStart: (state) => {
      state.users.isFetching = true;
    },
    deleteUserSuccess: (state, action) => {
      state.users.isFetching = false;
      state.message = action.payload;
    },
    deleteUserFailed: (state, action) => {
      state.users.isFetching = false;
      state.message = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getUserFailed,
  getUserSuccess,
  getUserStart,
  deleteUserFailed,
  deleteUserSuccess,
  deleteUserStart,
} = userSlice.actions;

export default userSlice.reducer;
