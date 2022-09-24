import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth-slice";
import groupsSlice from "./reducers/groups-slice";
import todosSlice from "./reducers/todos-slice";
import uiSlice from "./reducers/ui-slice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    todo: todosSlice,
    group: groupsSlice,
    ui: uiSlice,
  },
});

export default store;
