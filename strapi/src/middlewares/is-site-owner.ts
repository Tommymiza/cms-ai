import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import { ROLE } from "../../utils/constant";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    const currentUser = ctx.state.user;
    const siteId = ctx.params.id;
    const method = ctx.state.route.method;
    if (!currentUser) {
      return ctx.forbidden("You are not authorized to access this resource");
    }
    const userAdmin = await strapi.query("admin::user").findOne({
      where: {
        email: currentUser.email,
      },
    });
    if (!userAdmin) {
      ctx.notFound("User admin not found");
    }
    ctx.state.userInfo = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          id: currentUser.id,
        },
        populate: {
          role_admin: true,
        },
      });
    if (ctx.state.userInfo.role_admin.code !== ROLE.SUPER_ADMIN) {
      const userWebsites = await strapi.query("api::site.site").findMany({
        where: {
          users_websites: {
            id: ctx.state.userInfo.id,
          },
        },
      });
      if (["UPDATE", "DELETE"].includes(method) && siteId) {
        if (!userWebsites || userWebsites.length === 0) {
          return ctx.badRequest(
            "You're not allowed to do this action in this ressource"
          );
        }
      }

      if (method === "GET" && userWebsites.length > 0) {
        ctx.query = {
          ...ctx.query,
          filters: {
            ...(ctx.query?.filters || ({} as any)),
            id: { $in: userWebsites.map((site) => site.id) },
          },
        };

        return await next();
      } else if (method === "GET" && userWebsites.length === 0) {
        ctx.query = {
          ...ctx.query,
          filters: {
            ...(ctx.query?.filters || ({} as any)),
            users_websites: currentUser.id,
          },
        };
        return await next();
      }
    }
    await next();
  };
};
