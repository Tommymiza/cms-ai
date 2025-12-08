export default {
  routes: [
    {
      method: "GET",
      path: "/sites/byUrl",
      handler: "site.findByUrl",
      config: {
        auth: false,
        // middlewares: ["global::authenticated"],

        // middlewares: ["global::has-access-on-tenant"],
      },
    },
    {
      method: "POST",
      path: "/sites/saveSite",
      handler: "site.saveSite",
      config: {
        auth: false,
        middlewares: ["global::authenticated"],
      },
    },
    {
      method: "POST",
      path: "/sites/returnSite",
      handler: "site.returnSite",
      config: {
        auth: false,
        middlewares: ["global::authenticated"],
      },
    },
  ],
};
