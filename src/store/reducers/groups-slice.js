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
    deleteGroupReducer(state, action) {
      const responeGroup = action.payload.group;
      state.groups = state.groups.filter(
        (group) => group.id != responeGroup.id
      );
    },
    updateGroup(state, action) {
      const responeGroup = action.payload.group;
      const groupIndex = state.groups.findIndex(
        (group) => group.id === responeGroup.id
      );
      state.groups[groupIndex] = responeGroup;
    },
  },
});
export default groupsSlice.reducer;
export const {
  getGroupsReducer,
  createGroupReducer,
  deleteGroupReducer,
  updateGroup,
} = groupsSlice.actions;
