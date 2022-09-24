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
    sortTodos(state, action) {
      const { payload } = action;
      const ascending = (a, b) => {
        if (a.dueDate > b.dueDate) {
          return -1;
        }
        if (a.dueDate < b.dueDate) {
          return 1;
        }
        return 0;
      };
      const descending = (a, b) => {
        if (a.dueDate < b.dueDate) {
          return -1;
        }
        if (a.dueDate > b.dueDate) {
          return 1;
        }
        return 0;
      };
      if (payload === "ascending") {
        state.todos.sort(ascending);
      } else {
        state.todos.sort(descending);
      }
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
  sortTodos,
  clearTodos,
} = todoSlice.actions;
