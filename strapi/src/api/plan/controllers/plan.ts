/**
 * plan controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::plan.plan', ({ strapi }) => ({
    async find(ctx: Context) {

        const plans = await strapi.documents("api::plan.plan").findMany({
            sort: "id",
        });

        const planFeatures = await strapi.query('api::plan-feature.plan-feature').findMany({
            populate: {
                plan_id: true,
                feature_id: true,
            },
        });


        const groupedPlans = plans.map((plan) => {

            const featuresPlans = planFeatures
                .filter((pf) => pf.plan_id.id === plan.id)
                .map((pf) => ({
                    feature: pf.feature_id.name,
                    type: pf.feature_id.type,
                    description: pf.description,
                    value: pf.value,
                }));
            const sortedFeaturesPlans = featuresPlans.reduce(
                (acc, featurePlan) => {
                    if (featurePlan.type === 'feature') {
                        acc.features.push(featurePlan);
                    } else if (featurePlan.type === 'limit') {
                        acc.limits.push(featurePlan);
                    }
                    return acc;
                },
                { features: [], limits: [] }
            );
            return {
                id: plan.id,
                name: plan.name,
                description: plan.description,
                price_monthly: plan.price_monthly,
                price_yearly: plan.price_yearly,
                featured: plan.featured,
                credit: plan.credit,
                features_plans: sortedFeaturesPlans,
            };
        });

        return ctx.send(groupedPlans);
    },
}));
