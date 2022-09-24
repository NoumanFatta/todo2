import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import groupsSlice from "./reducers/groups-slice";
import todosSlice from "./reducers/todos-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    todo: todosSlice,
    group: groupsSlice
  },
});

export default store;
