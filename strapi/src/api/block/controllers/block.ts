/**
 * block controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::block.block",
  ({ strapi }) => ({
    async create(ctx) {
      async function addBlockRecursively(
        block: any,
        parentId: number,
        order: number
      ) {
        const { children, ...rest } = block;
        const newBlock = await strapi.query("api::block.block").create({
          data: {
            order: order,
            data: rest,
            parent: parentId,
          },
          populate: {
            parent: true,
          },
        });
        if (children && children.length > 0) {
          let i = 1;
          for (const child of children) {
            await addBlockRecursively(child, newBlock.id, i);
            i++;
          }
        }
        return newBlock;
      }
      const { data, parent, page, order } = ctx.request.body.data;
      const { children, ...rest } = data;
      let pageId = page;
      if (pageId) {
        const findPageContent = await strapi
          .query("api::page-content.page-content")
          .findOne({ where: { id: pageId } });
        pageId = findPageContent ? findPageContent.id : null;
      }
      const newBlock = await strapi.query("api::block.block").create({
        data: {
          data: rest,
          order: order,
          parent: parent || null,
          page: parent ? null : pageId,
        },
        populate: {
          parent: true,
          page: true,
        },
      });

      // Recursively add children blocks
      if (children && children.length > 0) {
        let i = 1;
        for (const child of children) {
          await addBlockRecursively(child, newBlock.id, i);
          i++;
        }
      }
      return ctx.send({ newBlock });
    },
    async update(ctx) {
      const { id: documentId } = ctx.params;
      const { data, page, ...rest } = ctx.request.body.data;
      let pageId = page;
      if (pageId) {
        const findPageContent = await strapi
          .query("api::page-content.page-content")
          .findOne({ where: { id: page } });
        pageId = findPageContent ? findPageContent.id : null;
      }
      if (data) {
        const { children, ...restOfData } = data;
        const updatedBlock = await strapi.query("api::block.block").update({
          where: { documentId: documentId },
          data: {
            ...rest,
            page: pageId,
            data: restOfData,
          },
          populate: {
            parent: true,
            page: true,
          },
        });
        async function addBlockRecursively(
          block: any,
          parentId: number,
          order: number
        ) {
          const { children, ...rest } = block;
          const newBlock = await strapi.query("api::block.block").create({
            data: {
              order: order,
              data: rest,
              parent: parentId,
            },
            populate: {
              parent: true,
            },
          });
          if (children && children.length > 0) {
            let i = 1;
            for (const child of children) {
              await addBlockRecursively(child, newBlock.id, i);
              i++;
            }
          }
          return newBlock;
        }
        // Handle children blocks update
        if (children && children.length > 0) {
          // delete all existing children blocks
          const existingBlocks = await strapi
            .query("api::block.block")
            .findMany({
              where: { parent: updatedBlock.id },
              populate: { parent: true },
            });

          for (const block of existingBlocks) {
            await strapi.query("api::block.block").delete({
              where: { documentId: block.documentId },
            });
          }
          // add new children blocks
          let i = 1;
          for (const child of children) {
            await addBlockRecursively(child, updatedBlock.id, i);
            i++;
          }
        }
        return ctx.send({ updatedBlock });
      } else {
        let updatedBlock = await strapi.query("api::block.block").update({
          where: { documentId: documentId },
          data: {
            ...rest,
            page: pageId,
          },
          populate: {
            parent: true,
            page: true,
          },
        });
        return ctx.send({ updatedBlock });
      }
    },
  })
);
