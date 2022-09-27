import { v4 as uuidv4 } from "uuid";
import { checkToken } from "./checkToken";
function UserException(title, message) {
  this.message = message;
  this.title = title;
}
const getDueDate = () => {
  const today = new Date();
  const dd = String(today.getDate() + 1).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
};
export const getActiveTodos = async (token, status) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const todoById = allTodos.filter(
      (todo) => todo.createdBy === isAuthencitaed.id && todo.status === status
    );
    const todoWithGroup = todoById.map((todo) => {
      const group = groups.find((group) => group.id === todo.group);
      return { ...todo, group: group.name };
    });
    return todoWithGroup;
  }
};

export const createTodo = async (token, newTodo) => {
  const { title, description, group, dueDate, priority } = newTodo;
  let success = false;
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    if ((title && description && group && dueDate, priority)) {
      if (getDueDate() <= dueDate) {
        const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
        const allGroups = JSON.parse(localStorage.getItem("groups"));
        const index = allGroups.findIndex((elem) => elem.id === group);
        const id = uuidv4();
        allGroups[index].todos.push(id);
        localStorage.setItem("groups", JSON.stringify(allGroups));
        allTodos.push({
          title,
          description,
          status: "active",
          group,
          id,
          dueDate,
          priority,
          createdBy: isAuthencitaed.id,
        });
        localStorage.setItem("todos", JSON.stringify(allTodos));
        success = true;
        const todoWithGroup = allTodos.map((todo) => {
          const group = allGroups.find((group) => group.id === todo.group);
          return { ...todo, group: group.name };
        });
        return { data: todoWithGroup[todoWithGroup.length - 1], success };
      } else {
        throw new UserException(
          "Invalid Due Date",
          "Please select correct due date"
        );
      }
    } else {
      throw new UserException("Missing fields", "All fields are required");
    }
  } else {
    throw Error("Not authorized");
  }
};

export const getTodoById = async (token, todoId) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const singleTodo = allTodos.find((todo) => todo.id === todoId);
    if (singleTodo) {
      const group = groups.find((group) => group.id === singleTodo.group);
      if (singleTodo.status === "active") {
        return { ...singleTodo, group: group.id };
      }
    }
  }
};

export const editTodo = async (token, todoId, newTodo) => {
  const { title, description, group, dueDate, priority } = newTodo;
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    if (getDueDate() <= dueDate) {
      const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
      const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
      const index = allTodos.findIndex((todo) => todo.id === todoId);
      if (index === -1) {
        throw new UserException("Not found", "Todo not found");
      }
      const oldGroupId = allTodos[index].group;
      const oldGroupIndex = allGroups.findIndex(
        (group) => group.id === oldGroupId
      );
      const todoIndex = allGroups[oldGroupIndex].todos.indexOf(todoId);
      if (todoIndex > -1) {
        allGroups[oldGroupIndex].todos.splice(todoIndex, 1);
      }
      const newGroupIndex = allGroups.findIndex(
        (groups) => groups.id === group
      );
      allGroups[newGroupIndex].todos.push(todoId);
      if ((title && description && group && dueDate, priority)) {
        allTodos[index].title = title;
        allTodos[index].description = description;
        allTodos[index].group = group;
        allTodos[index].dueDate = dueDate;
        allTodos[index].priority = priority;
        localStorage.setItem("todos", JSON.stringify(allTodos));
        localStorage.setItem("groups", JSON.stringify(allGroups));
        return { todo: allTodos[index], success: true };
      } else {
        throw new UserException("Missing fields", "All fields are required");
      }
    } else {
      throw new UserException(
        "Invalid Due Date",
        "Please select correct due date"
      );
    }
  }
};

export const changeStatus = async (token, todoId, status) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const index = allTodos.findIndex((todo) => todo.id === todoId);
    allTodos[index].status = status;
    localStorage.setItem("todos", JSON.stringify(allTodos));
    if (status === "completed") {
      const response = allTodos.filter((todo) => todo.status === "active");
      const filteredTodos = response.filter(
        (todo) => todo.createdBy === isAuthencitaed.id
      );
      const todoWithGroup = filteredTodos.map((todo) => {
        const group = allGroups.find((group) => group.id === todo.group);
        return { ...todo, group: group.name };
      });
      return {
        todos: todoWithGroup,
        success: true,
      };
    }
    const response = allTodos.filter((todo) => todo.status === "completed");
    const filteredTodos = response.filter(
      (todo) => todo.createdBy === isAuthencitaed.id
    );
    const todoWithGroup = filteredTodos.map((todo) => {
      const group = allGroups.find((group) => group.id === todo.group);
      return { ...todo, group: group.name };
    });
    return {
      todos: todoWithGroup,
      success: true,
    };
  }
};

export const deleleTodo = async (token, todoId) => {
  const isAuthencitaed = await checkToken(token);
  if (isAuthencitaed) {
    const allTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const todoIndex = allTodos.findIndex((todo) => todo.id === todoId);
    if (todoIndex === -1) {
      throw new UserException("Not found", "Todo not found");
    }
    const deletedTodo = allTodos.find((todo) => todo.id === todoId);
    const groupIndex = allGroups.findIndex(
      (group) => group.id === allTodos[todoIndex].group
    );
    const todoToBeDeleted = allGroups[groupIndex].todos.indexOf(todoId);
    if (todoToBeDeleted > -1) {
      allGroups[groupIndex].todos.splice(todoToBeDeleted, 1);
    } else {
      throw new UserException("Not found", "Todo not found");
    }
    allTodos.splice(todoIndex, 1);
    localStorage.setItem("todos", JSON.stringify(allTodos));
    localStorage.setItem("groups", JSON.stringify(allGroups));
    return {
      todo: deletedTodo,
    };
  }
};
