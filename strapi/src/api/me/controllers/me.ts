/**
 * A set of functions called "actions" for `me`
 */

export default {
  tokensSummary: async (ctx, next) => {
    if (!ctx.state.user) {
      return ctx.unauthorized("You must be logged in.");
    }

    console.log("ctx.query", ctx.query);
    // get the owner of the tenant
    const tenantMembership = await strapi
      .query("api::tenant-membership.tenant-membership")
      .findOne({
        populate: {
          tenant: true,
          user: true,
        },
        where: {
          role: {
            $eq: "owner",
          },
          tenant: {
            $eq: ctx.query.tenant,
          },
        },
      });

    if (!tenantMembership) throw new Error("Tenant not found");

    const tokenHistory = await strapi
      .query("api::token-history.token-history")
      .findOne({
        where: {
          users: {
            id: tenantMembership.user.id,
          },
        },
        orderBy: { createdAt: "desc" },
      });

    const balance = tokenHistory?.user_balance ?? 0;

    return {
      balance,
      ...ctx.state.user,
    };
  },
};
