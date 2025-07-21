"use strict";

module.exports = {
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/todos",
      handler: "api::todo.todo.find",
      config: {
        find: {
          auth: true,
        },
      },
    },
    {
      method: "POST",
      path: "/todos",
      handler: "api::todo.todo.create",
      config: {
        find: {
          auth: true,
        },
      },
    },
    {
      method: "PUT",
      path: "/todos/:id",
      handler: "api::todo.todo.update",
      config: {
        find: {
          auth: true,
        },
      },
    },
    {
      method: "DELETE",
      path: "/todos/:id",
      handler: "api::todo.todo.delete",
      config: {
        find: {
          auth: true,
        },
      },
    },
  ],
};
