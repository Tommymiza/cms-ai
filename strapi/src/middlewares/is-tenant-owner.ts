import type { Core } from "@strapi/strapi";
import { Context, Next } from "koa";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    const currentUser = ctx.state.user;
    const siteId = ctx.params.id;
    const tenantId = ctx.query.tenant;
    const method = ctx.state.route.method;

    console.log("Request query", ctx.query);

    if (!currentUser) {
      return ctx.forbidden("You are not authorized to access this resource");
    }

    ctx.state.tenantMembership = await strapi
      .query("api::tenant-membership.tenant-membership")
      .findOne({
        populate: {
          tenant: true,
          user: true,
        },
        where: {
          user: {
            $eq: currentUser.id,
          },
          tenant: {
            $eq: tenantId,
          },
        },
      });
    console.log("Tenant Membership", ctx.state.tenantMembership);
    if (!ctx.state.tenantMembership) {
      return ctx.forbidden("Tenant membership not foud ");
    }

    if (method === "GET") {
      return await next();
    }
    if (ctx.state.tenantMembership.role !== "owner") {
      return ctx.forbidden("You are not the owner of this ressource");
    }
    return await next();
  };
};
