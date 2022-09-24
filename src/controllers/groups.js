import { checkToken } from "./checkToken";
import { v4 as uuidv4 } from "uuid";

export const getAllGroups = async (token) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const groupById = allGroups.filter(
      (group) => group.createdBy === isAuthencitaed.id
    );
    const groupsWithTodos = groupById.map((todos) => {
      const obj = { ...todos };
      obj.todos = [];
      todos.todos.forEach((todoId) => {
        const fil = allTodos.filter((todo) => todo.id === todoId);
        obj.todos = [...obj.todos, ...fil];
      });
      return obj;
    });
    return groupsWithTodos;
  } else {
    return [];
  }
};

export const createGroup = async (token, newGroup) => {
  const { name } = newGroup;
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    if (name) {
      const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
      const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const id = uuidv4();
      allGroups.push({ name, todos: [], id, createdBy: isAuthencitaed.id });
      localStorage.setItem("groups", JSON.stringify(allGroups));
      const groupById = allGroups.filter(
        (groups) => groups.createdBy === isAuthencitaed.id
      );
      const groupsWithTodos = groupById.map((todos) => {
        const obj = { ...todos };
        obj.todos = [];
        todos.todos.forEach((todoId) => {
          const fil = allTodos.filter((todo) => todo.id === todoId);
          obj.todos = [...obj.todos, ...fil];
        });
        return obj;
      });
      return groupsWithTodos;
    }
  } else {
    return [];
  }
};
export const deleteGroup = async (token, groupId) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const filteredGroupIndex = allGroups.findIndex(
      (group) => group.id === groupId
    );
    if (filteredGroupIndex > -1) {
      const group = allGroups.find((group) => group.id === groupId);
      allGroups[filteredGroupIndex].todos.forEach((todoId) => {
        const todoIndex = allTodos.findIndex((todo) => todo.id === todoId);
        allTodos.splice(todoIndex, 1);
      });
      allGroups.splice(filteredGroupIndex, 1);
      localStorage.setItem("groups", JSON.stringify(allGroups));
      localStorage.setItem("todos", JSON.stringify(allTodos));
      return { group, success: true };
    } else {
      throw Error("Element not found");
    }
  } else {
    throw Error("Not authorized");
  }
};
