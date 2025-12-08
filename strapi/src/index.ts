import { Core, UID } from "@strapi/strapi";
import utils from "@strapi/utils";
import jwt from "jsonwebtoken";
import { sendInvitationEmail } from "../utils/send-email-registration";
import { getMeiliClient } from "./meili";

type GoogleUserData = {
  email: string;
  name: string;
  picture: string;
  sub: string;
  family_name: string;
  given_name: string;
  email_verified: boolean;
};

type FacebookUserData = {
  id: string;
  name: string;
  email: string;
  first_name: string;
  last_name: string;
};
type UserRoute = {
  method: string;
  path: string;
  handler: string;
  config: {
    auth: any;
    policies?: any[];
    middlewares?: any[];
  };
};
type Connect = {
  id: number;
  __temp_key__: string;
  name: string;
  label: string;
  href: string;
};

type ValueType = { connect: Connect[] };

function returnIdValue(value: ValueType): number {
  return value.connect[0].id;
}
function isValueType(value: any): value is ValueType {
  return (
    typeof value === "object" &&
    "connect" in value &&
    Array.isArray(value.connect)
  );
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi
      .plugin("users-permissions")
      .service("providers-registry")
      .add("google", {
        icon: "google", // Optionnel, mais utile pour un affichage dans l'admin UI
        enabled: true,
        grantConfig: {
          key: process.env.GOOGLE_CLIENT_ID,
          secret: process.env.GOOGLE_CLIENT_SECRET,
          callback: `${strapi.config.server.url}/auth/google/callback`,
          scope: ["email", "profile"],
          authorize_url: "https://accounts.google.com/o/oauth2/v2/auth",
          access_url: "https://oauth2.googleapis.com/token",
          oauth: 2,
        },
        async authCallback({ accessToken, providers, purest }) {
          const getUserInfo = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          const userData = (await getUserInfo.json()) as GoogleUserData;
          console.log("data", userData);
          if (!userData) {
            return;
          }
          // const { family_name, given_name, email, sub } = data;
          // console.log("getUserInfo", getUserInfo);
          // const { email, name } = getUserInfo.body
          const existingUser = await strapi
            .query("plugin::users-permissions.user")
            .findOne({ where: { email: userData.email }, populate: true });
          const existingUserAdmin = await strapi
            .query("admin::user")
            .findOne({ where: { email: userData.email }, populate: true });
          console.log(existingUser);
          if (existingUser && existingUserAdmin) {
            if (existingUser.provider !== "google") {
              await strapi.query("plugin::users-permissions.user").update({
                where: { id: existingUser.id },
                data: { provider: "google" },
              });
            }
            return existingUser;
          }
          const newUser = await strapi
            .query("plugin::users-permissions.user")
            .create({
              data: {
                email: userData.email,
                username: userData.sub,
                firstname: userData.given_name,
                lastname: userData.family_name,
                provider: "google",
                password: null,
                confirmed: true,
                blocked: false,
              },
            });
          await strapi.query("admin::user").create({
            data: {
              email: userData.email,
              username: userData.sub,
              firstname: userData.given_name,
              lastname: userData.family_name,
              provider: "google",
              password: null,
              confirmed: true,
              blocked: false,
            },
          });
          // console.log("newUser", newUser);
          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({ where: { id: newUser.id }, populate: true });

          return user;
        },
      });
    strapi
      .plugin("users-permissions")
      .service("providers-registry")
      .add("facebook", {
        icon: "facebook", // Optionnel, mais utile pour un affichage dans l'admin UI
        enabled: true,
        grantConfig: {
          key: process.env.FACEBOOK_CLIENT_ID, // ID client Facebook
          secret: process.env.FACEBOOK_CLIENT_SECRET, // Secret client Facebook
          callback: `${strapi.config.server.url}/auth/facebook/callback`,
          scope: ["email", "public_profile"],
          authorize_url: "https://www.facebook.com/v11.0/dialog/oauth", // URL pour l'authentification
          access_url: "https://graph.facebook.com/v11.0/oauth/access_token", // URL pour obtenir l'access token
          oauth: 2,
        },
        async authCallback({ accessToken, providers, purest }) {
          // Récupérer les informations de l'utilisateur via l'API de Facebook
          const getUserInfo = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,first_name,last_name&access_token=${accessToken}`
          );

          const userData = (await getUserInfo.json()) as FacebookUserData;
          console.log("data", userData);

          if (!userData) {
            return;
          }

          const existingUser = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: { email: userData.email },
              populate: true,
            });
          const existingUserAdmin = await strapi.query("admin::user").findOne({
            where: { email: userData.email },
            populate: true,
          });
          if (existingUser && existingUserAdmin) {
            if (existingUser.provider !== "facebook") {
              await strapi.query("plugin::users-permissions.user").update({
                where: { id: existingUser.id },
                data: { provider: "facebook" },
              });
            }
            return existingUser;
          }
          const newUser = await strapi
            .query("plugin::users-permissions.user")
            .create({
              data: {
                email: userData.email,
                username: userData.id,
                firstname: userData.first_name,
                lastname: userData.last_name,
                provider: "facebook",
                password: null,
                confirmed: true,
                blocked: false,
              },
            });
          await strapi.query("admin::user").create({
            data: {
              email: userData.email,
              username: userData.id,
              firstname: userData.first_name,
              lastname: userData.last_name,
              provider: "facebook",
              password: null,
              confirmed: true,
              blocked: false,
            },
          });

          const user = await strapi
            .query("plugin::users-permissions.user")
            .findOne({
              where: { id: newUser.id },
              populate: true,
            });

          return user;
        },
      });

    const userRoutes = strapi.plugins["users-permissions"].routes["content-api"]
      .routes as UserRoute[];
    const isUserOwnerMiddleware = "global::is-owner";
    // find many
    const findUser = userRoutes.find(
      (route) =>
        route.path === "/users" &&
        route.method === "GET" &&
        route.handler === "user.find"
    );
    // find one
    const findOneUser = userRoutes.find(
      (route) =>
        route.path === "/users/:id" &&
        route.method === "GET" &&
        route.handler === "user.findOne"
    );
    // delete one
    const deleteOneUser = userRoutes.find(
      (route) =>
        route.path === "/users/:id" &&
        route.method === "DELETE" &&
        route.handler === "user.destroy"
    );

    // update one
    const updateOneUser = userRoutes.find(
      (route) =>
        route.path === "/users/:id" &&
        route.method === "PUT" &&
        route.handler === "user.update"
    );

    const initializeRoute = (routes: UserRoute) => {
      routes.config.middlewares = routes.config.middlewares || [];
      routes.config.policies = routes.config.policies || [];
    };

    if (findUser) {
      initializeRoute(findUser);
      findUser.config.middlewares.push(isUserOwnerMiddleware);
    }
    if (findOneUser) {
      initializeRoute(findOneUser);
      findOneUser.config.middlewares.push(isUserOwnerMiddleware);
    }
    if (deleteOneUser) {
      initializeRoute(deleteOneUser);
      deleteOneUser.config.middlewares.push(isUserOwnerMiddleware);
    }
    if (updateOneUser) {
      initializeRoute(updateOneUser);
      updateOneUser.config.middlewares.push(isUserOwnerMiddleware);
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // const client = algoliasearch(
    //   process.env.ALGOLIA_PROVIDER_APPLICATION_ID,
    //   process.env.ALGOLIA_PROVIDER_ADMIN_API_KEY
    // );

    const indexServiceName = "service";
    const indexProduitName = "produit";
    const indexProduitCategoryName = "produit-category";
    const indexBureauName = "bureau";
    const indexEtudeCasName = "etude-cas";
    const indexPartenaireName = "partenaire";
    const indexAvisClientName = "avis-client";
    const indexFaqName = "faq";
    const indexEquipeName = "equipe";

    const { ApplicationError, ValidationError, NotFoundError, ForbiddenError } =
      utils.errors;

    strapi.server.httpServer.requestTimeout = 30 * 60 * 1000;
    strapi.db.lifecycles.subscribe({
      models: ["api::site.site"],
      afterCreate: async (event) => {
        const site = event.result;

        const client = getMeiliClient("FR", "free"); // Pour l’instant fixe
        const index = await client.createIndex(`site_${site.id}_content`, {
          primaryKey: "objectID",
        });

        await client.index(`site_${site.id}_content`).updateSettings({
          filterableAttributes: ["indexName"],
        });

        strapi.log.info(`Index Meilisearch créé : site_${site.id}_content`);
      },
      beforeDelete: async (event) => {
        try {
          const { where } = event.params;
          console.log(event.params);
          // meilisearch delete index
          const site = await strapi.query("api::site.site").findOne({
            where: { documentId: where.documentId },
          });
          const client = getMeiliClient("FR", "free");
          await client.deleteIndex(`site_${site.id}_content`);
          strapi.log.info(
            `Index Meilisearch supprimé : site_${site.id}_content`
          );
        } catch (error) {
          console.log(error);
        }
      },
      afterDelete: async (event) => {
        console.log("delete all entries");

        const relations: UID.Schema[] = [
          "api::list.list",
          "api::page.page",
          "api::component.component",
          "api::history.history",
        ];

        const promisesRelations = relations.map(async (relation) => {
          const entries = await strapi.query(relation).findMany({
            where: { website: null },
            populate: { website: true },
          });
          const deletePromises = entries.map(
            async (entry) =>
              await strapi.query(relation).delete({
                where: { id: entry.id },
              })
          );
          await Promise.all(deletePromises);
        });
        await Promise.all(promisesRelations);

        const relationsList: UID.Schema[] = [
          "api::list-schema.list-schema",
          "api::list-item.list-item",
        ];

        const promisesRelationsList = relationsList.map(async (relation) => {
          const entries = await strapi.query(relation).findMany({
            where: { type: null },
            populate: { type: true },
          });
          const deletePromises = entries.map(
            async (entry) =>
              await strapi.query(relation).delete({
                where: { id: entry.id },
              })
          );
          await Promise.all(deletePromises);
        });
        await Promise.all(promisesRelationsList);

        const allPagesContent = await strapi
          .query("api::page-content.page-content")
          .findMany({
            where: { pages: null },
          });
        await Promise.all(
          allPagesContent.map(async (p) => {
            await strapi.query("api::page-content.page-content").delete({
              where: { documentId: p.documentId },
            });
          })
        );

        let entries = await strapi.query("api::block.block").findMany({
          where: { $and: [{ page: null }, { parent: null }] },
          populate: { page: true, parent: true },
        });
        while (entries.length > 0) {
          const deletePromises = entries.map(
            async (entry) =>
              await strapi.query("api::block.block").delete({
                where: { documentId: entry.documentId },
              })
          );
          await Promise.all(deletePromises);
          entries = await strapi.query("api::block.block").findMany({
            where: { $and: [{ page: null }, { parent: null }] },
            populate: { page: true, parent: true },
          });
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ["api::token-history.token-history"],
      beforeCreate: async (event) => {
        console.log("Before creation event!");
        const { data } = event.params;

        console.log("Event content:", data);
        console.log("data.model", data.model);
        // Getting current user
        const ctx = strapi.requestContext.get();

        if (!data.from_users) {
          const authHeader = ctx?.request?.header?.authorization;

          if (!authHeader) throw new Error("No authorization header");
          const token = authHeader.replace("Bearer ", "");
          const decoded: any = jwt.verify(
            token,
            strapi.config.get("plugin::users-permissions.jwtSecret")
          );
          console.log("Decoded content:", decoded);
          data.from_users = decoded.id;
        }

        console.log("data.from_users", data.from_users);
        if (!data.from_users) throw new Error("Current user not found");

        // get the owner of the tenant
        console.log("data.tenant", data.tenant);
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
                id: data.tenant,
              },
            },
          });

        if (!tenantMembership) throw new Error("Tenant not found");
        data.users = tenantMembership.user;

        //get user balance
        console.log("data.users", data.users);
        const user = await strapi
          .query("api::token-history.token-history")
          .findOne({
            where: {
              users: data.users,
            },
            orderBy: { createdAt: "desc" },
          });
        const balance = user?.user_balance ?? 0;
        console.log("Current balance:", balance);

        switch (data.type) {
          case "refund":
            if (data.tweeksy_amount === null)
              throw new Error("Tweeksy amount not found");
            data.token_amount = 0;
            data.user_balance = balance + data.tweeksy_amount;
            break;
          case "input_token":
          case "output_token":
          case "image_generation":
            const model_provider_name = data.model;
            console.log("model_provider_name", model_provider_name);

            if (!model_provider_name)
              throw new Error("Model provider not found");
            const model_provider = await strapi
              .query("api::model-provider.model-provider")
              .findOne({
                where: {
                  model: model_provider_name,
                },
              });
            if (!model_provider) throw new Error("Model not found");
            console.log("model_provider", model_provider);
            data.provider = model_provider.id;
            const token_ratio = model_provider.ratio_tweeksy;
            console.log("token_ratio", token_ratio);
            if (data.token_amount === null)
              throw new Error("Token amount not found");
            data.tweeksy_amount = -data.token_amount / token_ratio;

            console.log("data.tweeksy_amount", data.tweeksy_amount);
            console.log("balance", balance);
            if (data.token_amount / token_ratio > balance) {
              throw new ForbiddenError("Not enough balance");
            }

            data.user_balance = balance + data.tweeksy_amount;
            break;
          default:
            throw new Error("Invalid token history type");
        }
        console.log("Final data", data);
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ["api::tenant-membership.tenant-membership"],
      beforeCreate: async (event) => {
        console.log("Before Tenant Membership creation event!");
        const { data } = event.params;

        console.log("Event content:", data);
        const ctx = strapi.requestContext.get();

        // if (!data.from_users) {
        //   const authHeader = ctx?.request?.header?.authorization;

        //   if (!authHeader) throw new Error("No authorization header");
        //   const token = authHeader.replace("Bearer ", "");
        //   const decoded: any = jwt.verify(
        //     token,
        //     strapi.config.get("plugin::users-permissions.jwtSecret")
        //   );
        //   console.log("Decoded content:", decoded);
        // }

        // get user
        // console.log("User id:", data.user);
        // const userId = data.user?.set?.[0]?.id
        // if (!userId) throw new Error("User not found");
        // const user = await strapi.query("plugin::users-permissions.user").findOne({
        //   where: {
        //     id: userId,
        //   },
        // });
        // if (!user) throw new Error("User not found");
        // console.log("User content:", user);

        if (data.role === "owner") data.is_registred = true;
        else data.is_registred = false;
      },
      afterCreate: async (event) => {
        console.log("After Tenant Membership creation event!");
        const { result } = event;
        console.log("Event content:", result.id);
        const invitationToken = jwt.sign(
          { tenantId: result.id },
          strapi.config.get("plugin::users-permissions.jwtSecret"),
          {
            expiresIn: "1d",
          }
        );

        const tenant_membership = await strapi
          .query("api::tenant-membership.tenant-membership")
          .findOne({
            populate: {
              tenant: true,
              user: true,
            },
            where: {
              id: result.id,
            },
          });
        console.log("Final data", result);

        if (result.role !== "owner") {
          await sendInvitationEmail(strapi, {
            email: tenant_membership.user.email,
            invitationToken: invitationToken,
            role: tenant_membership.role,
          });
        }
      },
    });
  },
};
