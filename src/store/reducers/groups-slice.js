import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  groups: [],
  isLoading: true,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    getGroupsReducer(state, aciton) {
      state.isLoading = false;
      state.groups = aciton.payload;
    },
    createGroupReducer(state, aciton) {
      state.groups = aciton.payload;
    },
  },
});
export default groupsSlice.reducer;
export const { getGroupsReducer, createGroupReducer } = groupsSlice.actions;
