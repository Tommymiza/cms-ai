import { Core } from "@strapi/strapi";
import jwt from "jsonwebtoken";
import { Context, Next } from "koa";

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: Context, next: Next) => {
    try {
      const authorization = ctx.request.headers.authorization;
      const token = authorization.split(" ")[1];
      if (!token) {
        return ctx.badRequest("You are not allowed to access this page");
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken) {
        return ctx.badRequest("You are not allowed to access this page");
      }
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
      return await next();
    } catch (error) {
      console.log("error", error);
      return ctx.badRequest("Invalid token or expired token");
    }
  };
};
