export default (config, { strapi }) => {
    return async (ctx, next) => {
      // console.log("Incoming request:", ctx.request.method, ctx.request.url);
      // console.log("Headers:", ctx.request.headers);
      // console.log("Body:", ctx.request.body);
      await next();
    };
}