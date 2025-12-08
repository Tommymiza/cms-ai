// path: /config/env/production/server.ts
export default ({ env }) => ({
  proxy: true,
  url: env("BASE_URL", "https://lobster-app-wghu2.ondigitalocean.app"), // Sets the public URL of the application.
  app: {
    keys: env.array("APP_KEYS"),
  },
});
