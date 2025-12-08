/**
 * site controller
 */
import { factories } from "@strapi/strapi";
import { Context } from "koa";
import { addDefaultData } from "../../../../utils/add-property-by-template";

const websitePopulate = {
  default_visitor_culture: true,
  users_websites: true,
  components: true,
};
export default factories.createCoreController(
  "api::site.site",
  ({ strapi }) => ({
    async find(ctx: Context) {
      const { meta } = await super.find(ctx);
      const filters = ctx.query.filters || {};

      // const res = await strapi.query("api::site.site").findMany({
      //   populate: ['default_visitor_culture', 'template_id', 'website_classification_id', 'users_websites', 'properties', 'docs'],
      //   filters
      // });

      const tenantMembership = ctx.state.tenantMembership;
      if (tenantMembership.role === "editor") {
        const tenantAccess = await strapi
          .query("api::editor-tenant-access.editor-tenant-access")
          .findMany({
            populate: {
              tenant_membership: true,
              website: true,
            },
            where: {
              tenant_membership: tenantMembership.id,
            },
          });

        console.log("tenantAccess", tenantAccess);

        return ctx.send({
          data: tenantAccess.map((access) => access.website),
          meta,
        });
      }

      const res = await strapi.documents("api::site.site").findMany({
        filters,
        populate: ["default_visitor_culture", "users_websites"],
        // populate: true,
      });

      // const classificationIds = res.map(
      //   (site) => site.website_classification_id.id
      // );
      // const templateIds = res.map((site) => site.template_id.id);
      // const properties = await strapi.query("api::proprety.proprety").findMany({
      //   where: {
      //     $or: [
      //       {
      //         website_classification_id: {
      //           $in: classificationIds,
      //         },
      //       },
      //       {
      //         template_id: {
      //           $in: templateIds,
      //         },
      //       },
      //     ],
      //   },
      //   populate: {
      //     properties_section_id: true,
      //     property_name: true,
      //   },
      // });
      const data = res.map((site) => {
        return {
          ...site,
          // properties,
        };
      });
      //  console.log("properties", properties);
      return ctx.send({ data: data, meta });
    },

    async findOne(ctx: Context) {
      console.log("findOne", ctx.params.id);
      const siteId = ctx.params.id;
      const filters = ctx.query.filters || {};
      const website = await strapi.documents("api::site.site").findOne({
        documentId: siteId,
        filters,
        populate: websitePopulate,
      });

      return ctx.send({
        data: website,
      });
    },

    async delete(ctx) {
      const siteId = ctx.params.id;
      const website = await strapi.query("api::site.site").findOne({
        where: {
          documentId: siteId,
        },
      });

      // if (!website) {
      //   return ctx.notFound("Site not found");
      // }
      // const deleteVercelDomain = await deleteTweeksySubDomain(
      //   website.tweeksy_domain_name
      // );
      // const deletePreviewVercelDomain = await deleteTweeksySubDomain(
      //   website.tweeksy_preview_domain_name
      // );
      // if (
      //   deleteVercelDomain instanceof VercelError ||
      //   deletePreviewVercelDomain instanceof VercelError
      // ) {
      //   return ctx.badRequest(deleteVercelDomain);
      // }

      await strapi.query("api::site.site").delete({
        where: {
          documentId: siteId,
        },
      });

      return ctx.send({
        data: website,
      });
    },

    async create(ctx) {
      try {
        const { data, ...rest } = ctx.request.body;
        console.log(rest);
        const siteData = {
          ...rest,
          users_websites: ctx.state.userInfo.id,
        };
        const newSite = await strapi.query("api::site.site").create({
          data: {
            ...siteData,
          },
          populate: {
            default_visitor_culture: true,
          },
        });

        if (!newSite) {
          return ctx.badRequest("Site not created");
        }
        await addDefaultData(newSite.id, data);
        // create new history
        console.log("Create a new history for the site");
        const dataHistory = await this.findIntern({
          query: {
            url: newSite.tweeksy_preview_domain_name,
          },
        });
        const newHistory = await strapi.query("api::history.history").create({
          data: {
            website: newSite.id,
            data: dataHistory.data,
          },
        });
        if (!newHistory) {
          return ctx.badRequest("History not created");
        }
        console.log("Finished creating a new history for the site");
        return ctx.send({ data: newSite });
      } catch (error: any) {
        console.log("error", error);
        return ctx.badRequest("Error:" + error.message);
      }
    },

    async findIntern(ctx: any) {
      const { url } = ctx.query;
      console.log("url", url);
      const findWebsitePopulate = {
        default_visitor_culture: true,
        pages: {
          parent: true,
        },
        components: true,
      };
      const website = await strapi.query("api::site.site").findOne({
        where: {
          $or: [
            {
              main_domain_name: url,
            },
            {
              tweeksy_domain_name: url,
            },
            {
              tweeksy_preview_domain_name: url,
            },
          ],
        },
        populate: findWebsitePopulate,
      });
      if (!website) {
        return ctx.notFound("site not found");
      }
      return website;
    },

    async findByUrl(ctx: Context) {
      const { url } = ctx.query;

      const findWebsitePopulate = {
        default_visitor_culture: true,
        pages: {
          populate: {
            parent: true,
            children: true,
            page_content: true,
          },
        },
        components: true,
      };
      const website = await strapi.query("api::site.site").findOne({
        where: {
          $or: [
            {
              main_domain_name: url,
            },
            {
              tweeksy_domain_name: url,
            },
            {
              tweeksy_preview_domain_name: url,
            },
          ],
        },
        populate: findWebsitePopulate,
      });

      if (!website) {
        return ctx.notFound("site not found");
      }
      async function getBlocksRecursive(parentId = null, pageId = null) {
        // Cherche les blocs racine ou enfants selon parentId
        const blocks = await strapi.db.query("api::block.block").findMany({
          where: {
            $and: [
              parentId ? { parent: parentId } : { parent: null },
              pageId ? { page: pageId } : {},
            ],
          },
          orderBy: { order: "asc" },
        });

        // Pour chaque bloc, on récupère récursivement ses enfants
        const result = await Promise.all(
          blocks.map(async (block) => {
            const children = await getBlocksRecursive(block.id);
            if (children.length > 0) {
              return { ...block, children };
            }
            return { ...block };
          })
        );

        return result;
      }

      website.pages = await Promise.all(
        website.pages.map(async (page) => ({
          ...page,
          blocks: await getBlocksRecursive(null, page.page_content.id),
        }))
      );

      return ctx.send({
        data: {
          ...website,
        },
      });
    },

    async saveSite(ctx: Context) {
      const { site, pageId } = ctx.request.body;
      if (!site) {
        return ctx.badRequest("Site data is required");
      }
      const newHistory = await strapi.query("api::history.history").create({
        data: {
          website: site.id,
          data: site,
        },
      });
      if (!newHistory) {
        return ctx.badRequest("History not created");
      }
      return ctx.send({ data: newHistory });
    },

    async returnSite(ctx: Context) {
      const { documentId, pageDocumentId } = ctx.request.body;

      return ctx.send({
        data: {
          success: true,
          message: "Site returned successfully",
        },
      });
    },
  })
);
