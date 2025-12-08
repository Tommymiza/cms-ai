export const planResetTask = {
  
    myJob: {
      task: async ({ strapi }) => {
        console.log("[CRON TASK]Testing cron every 1 minutes")
        const users = await strapi.db.query('plugin::users-permissions.user').findMany({
            populate: { plan: true }
        });
        users.forEach(async user => {
            if(!user.plan) return
            const tokenHistory = await strapi.query("api::token-history.token-history").findOne({
                where: {
                    users: {
                        id: user.id,
                    },
                },
                orderBy: { createdAt: 'desc' }
            });
            
            const balance = tokenHistory?.user_balance ?? 0;

            await strapi.db.query("api::token-history.token-history").create({
                data: {
                    users: user.id,
                    tweeksy_amount: user.plan.credit-Math.abs(balance),
                    type: "refund"
                }
            });

            console.log(`User ${user.email} has plan ${user.plan.name} and balance ${balance}, need to add ${balance + user.plan.credit-Math.abs(balance)}`)
        })
      },
      options: {
        rule: "0 0 1 * *",
      }
    },
};