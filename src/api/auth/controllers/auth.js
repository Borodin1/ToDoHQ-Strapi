module.exports = {
  //REGISTER
  async register(ctx) {
    try {
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        username,
      } = ctx.request.body;

      if (
        !email ||
        !password ||
        !confirmPassword ||
        !firstName ||
        !lastName ||
        !username
      ) {
        return ctx.badRequest("All fields are required!");
      }

      if (password !== confirmPassword) {
        return ctx.badRequest("Passwords do not match!");
      }

      const existingUser = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { email } });

      if (existingUser) {
        return ctx.badRequest("Email already registered!");
      }

      const authenticatedRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "authenticated" } });

      const newUser = await strapi.plugins[
        "users-permissions"
      ].services.user.add({
        email,
        password,
        firstName,
        lastName,
        username,
        confirmed: true,
        blocked: false,
        role: authenticatedRole.id,
      });

      return ctx.send({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
      });
    } catch (err) {
      console.error("Registration error:", err);
      return ctx.internalServerError("Registration error!");
    }
  },

  //LOGIN
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;

      if (!identifier || !password) {
        return ctx.badRequest("Username or email and password are required!");
      }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: {
            $or: [{ email: identifier }, { username: identifier }],
          },
        });

      if (!user) {
        return ctx.badRequest("User not found!");
      }

      if (user.blocked) {
        return ctx.forbidden("Your account is blocked!");
      }

      const validPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);

      if (!validPassword) {
        return ctx.badRequest("Invalid credentials!");
      }

      const token = await strapi.plugins[
        "users-permissions"
      ].services.jwt.issue({
        id: user.id,
      });

      return ctx.send({
        jwt: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return ctx.internalServerError("Login error!");
    }
  },

  //Update User
  async updateProfile(ctx) {
    try {
      const userId = ctx.state.user.id;
      const { firstName, lastName, username, email } = ctx.request.body;
      console.log("updateProfile request body:", ctx.request.body);

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({ where: { id: userId } });

      if (!user) {
        return ctx.notFound("User not found!");
      }

      if (email && email !== user.email) {
        const existingEmail = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { email } });

        if (existingEmail) {
          return ctx.badRequest("Email already taken!");
        }
      }

      if (username && username !== user.username) {
        const existingUsername = await strapi
          .query("plugin::users-permissions.user")
          .findOne({ where: { username } });

        if (existingUsername) {
          return ctx.badRequest("Username already taken!");
        }
      }

      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        return ctx.badRequest("No data provided to update!");
      }

      const updatedUser = await strapi
        .query("plugin::users-permissions.user")
        .update({
          where: { id: userId },
          data: updateData,
        });

      return ctx.send({
        email: updatedUser.email,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
      });
    } catch (err) {
      console.error("Update profile error:", err);
      return ctx.internalServerError("Could not update profile!");
    }
  },
};
