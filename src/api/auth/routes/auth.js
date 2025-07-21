module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/register",
      handler: "auth.register",
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/auth/login",
      handler: "auth.login",
      config: {
        auth: false,
      },
    },
    {
      method: "PUT",
      path: "/auth/update-profile",
      handler: "auth.updateProfile",
      config: {
        auth: { scope: [] },
      },
    },
  ],
};
