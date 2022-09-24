import { createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";
const user = cookie.load("user");
const initialState = user
  ? {
      isLoggedIn: true,
      user,
      userData: {},
    }
  : { isLoggedIn: false, user: null, userData: {} };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginReducer(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload.token;
      cookie.save("user", action.payload.token, { path: "/" });
    },
    logoutUser(state) {
      state.isLoggedIn = false;
      state.user = null;
      cookie.remove("user", { path: "/" });
    },
    setUserData: (state, action) => {
      if (!state.userData?.id) {
        state.userData = action.payload;
      }
    },
  },
});
export default authSlice.reducer;
export const { loginReducer, setUserData, logoutUser } = authSlice.actions;
