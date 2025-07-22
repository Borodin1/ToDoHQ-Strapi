module.exports = ({ env }) => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "defaultAdminJwtSecret"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "defaultSalt"),
  },
});
