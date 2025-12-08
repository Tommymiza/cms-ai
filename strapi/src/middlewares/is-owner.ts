import type { Core } from "@strapi/strapi";
import { Context } from "koa";
import _ from "lodash";
import { ROLE } from "../../utils/constant";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: any) => {
    const currentUser = ctx.state.user;
    const userId = ctx.params.id;
    const method = ctx.state.route.method;
    if (!currentUser) {
      return ctx.badRequest("You are not allowed to access this page");
    }
    const isSameUSerId = Number(userId) !== Number(currentUser.id);
    if (currentUser.role.type !== "authenticated") {
      strapi.log.info("you are not authenticated");
      return ctx.badRequest("You are not allowed to access this page");
    }
    const currentUserInfo = await strapi
      .query("plugin::users-permissions.user")
      .findOne({
        where: {
          id: currentUser.id,
        },
        populate: true,
      });

    if (currentUserInfo.role_admin.code !== ROLE.SUPER_ADMIN) {
      if (!userId && method === "GET") {
        ctx.query = {
          ...ctx.query,
          filters: {
            ...(ctx.query?.filters || ({} as any)),
            users_websites: currentUser.id,
          },
        };
        return await next();
      }

      if (isSameUSerId) {
        strapi.log.info("you are not the owner");
        console.log("test", userId !== currentUser.id);
        return ctx.unauthorized("You are not allowed to access this page");
      }

      if (isSameUSerId && method === "UPDATE") {
        ctx.request.body = _.pick(ctx.request.body, [
          "firstname",
          "lastname",
          "email",
          "username",
        ]);
      }
    }
    await next();
  };
};
