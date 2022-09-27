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
    deleteTodoReducer(state, action) {
      const todo = action.payload;
      state.todos = state.todos.filter((todos) => todos.id !== todo.id);
    },
    clearTodos(state) {
      state.todos = [];
    },
  },
});
export default todoSlice.reducer;
export const {
  getActiveTodosReducer,
  createTodoReducer,
  getTodoByIdReducer,
  updateTodo,
  deleteTodoReducer,
  clearTodos,
} = todoSlice.actions;
