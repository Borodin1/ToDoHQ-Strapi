"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::todo.todo", ({ strapi }) => ({
  async find(ctx) {
    console.log("🔍 ctx.state.user:", ctx.state.user);
    const userId = ctx.state.user?.id;
    if (!userId) {
      return ctx.unauthorized("You must be logged in.");
    }

    const todos = await strapi.entityService.findMany("api::todo.todo", {
      filters: { users_permissions_user: userId },
    });

    return todos;
  },
  async create(ctx) {
    const { title, description, priority, completed } = ctx.request.body.data;
    console.log("🔍 ctx.state.user:", ctx.state.user);

    const data = {
      title,
      description,
      priority,
      completed,
      users_permissions_user: ctx.state.user.id,
    };

    const todo = await strapi.entityService.create("api::todo.todo", { data });

    return todo;
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;
    const { title, description, priority, completed } = data;

    console.log("Received update request for ID:", id);
    console.log("Request body:", ctx.request.body);
    console.log("Extracted fields:");
    console.log("  title:", title);
    console.log("  description:", description);
    console.log("  priority:", priority);
    console.log("  completed:", completed);

    const updatedTodo = await strapi.entityService.update(
      "api::todo.todo",
      id,
      { data: { title, description, priority, completed } }
    );

    return updatedTodo;
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const deletedTodo = await strapi.entityService.delete("api::todo.todo", id);
    return deletedTodo;
  },
}));
