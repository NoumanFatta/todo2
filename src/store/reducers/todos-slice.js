import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  todos: [],
  singleTodo: {},
  isLoading: true,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    getActiveTodosReducer(state, action) {
      state.isLoading = false;
      state.todos = action.payload;
    },
    createTodoReducer(state, action) {
      state.todos.push(action.payload);
    },
    getTodoByIdReducer(state, action) {
      state.singleTodo = action.payload;
    },
    updateTodo(state, action) {
      state.singleTodo = action.payload.todo;
    },
  },
});
export default todoSlice.reducer;
export const {
  getActiveTodosReducer,
  createTodoReducer,
  getTodoByIdReducer,
  updateTodo,
} = todoSlice.actions;
