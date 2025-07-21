"use strict";

module.exports = {
  async findAll() {
    return await strapi.entityService.findMany("api::todo.todo", {});
  },

  async findById(id) {
    return await strapi.entityService.findOne("api::todo.todo", id, {});
  },

  async create(data, userId) {
    return await strapi.entityService.create("api::todo.todo", {
      data: {
        ...data,
        users_permissions_user: userId,
      },
    });
  },

  async update(id, data) {
    return await strapi.entityService.update("api::todo.todo", id, { data });
  },

  async delete(id) {
    return await strapi.entityService.delete("api::todo.todo", id);
  },
};
