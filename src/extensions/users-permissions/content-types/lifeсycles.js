module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (!data.role) {
      const role = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "authenticated" } });
      data.role = role.id;
    }
  },
};
