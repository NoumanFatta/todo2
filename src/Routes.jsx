import React, { useEffect } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import BlankLayout from "./components/BlankLayout";
import MainLayout from "./components/MainLayout";
import EditTodo from "./pages/EditTodo";
import Groups from "./pages/Groups";
import Todos from "./pages/Todos";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
const Routes = ({ isLoggedIn }) => {
  useEffect(() => {
    const allUsers = JSON.parse(localStorage.getItem("users"));
    if (!allUsers) {
      const user = [
        {
          firstName: "Dev",
          lastName: "test",
          email: "test@test.com",
          password: "123",
          id: "871e596e-9b98-43e0-ae4b-b73c98df9f73",
        },
      ];
      const groups = [
        {
          name: "Group 1",
          todos: ["d74674fc-8c21-4715-9fb8-b0a87cb42dfd"],
          id: "81bcdef6-6262-4bd6-96ec-0c9882eafb82",
          createdBy: "871e596e-9b98-43e0-ae4b-b73c98df9f73",
        },
      ];
      const todos = [
        {
          title: "Title 2",
          description: "desciption 2",
          status: "active",
          group: "81bcdef6-6262-4bd6-96ec-0c9882eafb82",
          id: "d74674fc-8c21-4715-9fb8-b0a87cb42dfd",
          createdBy: "871e596e-9b98-43e0-ae4b-b73c98df9f73",
        },
      ];
      localStorage.setItem("users", JSON.stringify(user));
      localStorage.setItem("groups", JSON.stringify(groups));
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, []);

  let element = useRoutes([
    {
      path: "/",
      element: isLoggedIn ? <MainLayout /> : <Navigate to="/login" />,
      children: [
        {
          index: true,
          element: isLoggedIn ? (
            <Navigate to="todos" />
          ) : (
            <Navigate to="/login" />
          ),
        },
        {
          path: "todos",
          element: <Todos status="active" />,
        },
        {
          path: "todos/:id",
          element: <EditTodo />,
        },
        {
          path: "todos/completed",
          element: <Todos status="completed" />,
        },
        {
          path: "groups",
          element: <Groups />,
        },
      ],
    },
    {
      path: "/",
      element: !isLoggedIn ? <BlankLayout /> : <Navigate to="/todos" />,
      children: [
        { path: "/login", element: <Signin /> },
        { path: "/signup", element: <Signup /> },
      ],
    },
  ]);

  return element;
};

export default Routes;
