import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import { ROLE } from "../../utils/constant";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    const authorization = ctx.request.headers.authorization;
    const token = authorization.split(" ")[1];
    console.log("has access on tenant token", token);
    if (!token) {
      return ctx.badRequest("You are not allowed to access this page");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return ctx.badRequest("You are not allowed to access this page");
    }
    console.log("decodedToken id:", (decodedToken as any).id);
    const user = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          id: (decodedToken as any).id,
        },
        populate: true,
      });
    if (!user) {
      return ctx.badRequest("You are not allowed to access this page");
    }
    ctx.state.user = user;
    console.log("currentUser", user);
    const siteUrl = ctx.query.url;
    const method = ctx.state.route.method;
    if (!user) {
      return ctx.forbidden("You are not authorized to access this resource");
    }
    console.log("params", ctx.query)
    console.log("siteUrl", siteUrl);
    const site = await strapi.query("api::site.site").findOne({
      populate: ['tenant'],
      where: {
          $or: [
            {
              main_domain_name: siteUrl,
            },
            {
              tweeksy_domain_name: siteUrl,
            },
            {
              tweeksy_preview_domain_name: siteUrl,
            },
          ],
        },
    });
    if (!site) {
      ctx.notFound("Site not found");
    }
    console.log("Where query", {
      id: site.tenant.id,
    });
    const tenant = await strapi.query("api::tenant.tenant").findOne({
      where: {
        id: site.tenant.id,
      },
    });
    if (!tenant) {
      ctx.notFound("Tenant not found");
    }
    console.log("tenant", tenant);
    const tenantMemberShip = await strapi.query("api::tenant-membership.tenant-membership").findOne({
      where: {
        user: user.id,
        tenant: tenant.id,
      },
    });
    if (!tenantMemberShip) {
      ctx.notFound("Tenant member ship not found");
    }
    
    await next();
  };
};
