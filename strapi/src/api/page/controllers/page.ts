/**
 * page controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::page.page",
  ({ strapi }) => ({
    async create(ctx) {
      try {
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
        const { blocks, page_content, ...rest } = ctx.request.body.data;
        let pageContent = page_content;
        if (!pageContent) {
          const newPageContent = await strapi
            .query("api::page-content.page-content")
            .create({
              data: {},
            });
          pageContent = newPageContent.id;
        }
        const newPage = await strapi.query("api::page.page").create({
          data: {
            ...rest,
            page_content: pageContent,
          },
          populate: {
            website: true,
            page_content: true,
          },
        });
        if (!page_content) {
          let i = 1;
          for (const block of blocks) {
            const { children, ...blockWithoutChildren } = block;
            const newBlock = await strapi.query("api::block.block").create({
              data: {
                order: i,
                data: blockWithoutChildren,
                page: pageContent,
              },
              populate: {
                page: true,
              },
            });
            // Recursively add children blocks
            if (children && children.length > 0) {
              let j = 1;
              for (const child of children) {
                await addBlockRecursively(child, newBlock.id, j);
                j++;
              }
            }
            i++;
          }
        }
        return ctx.send(newPage);
      } catch (error) {
        console.log(error);
        return ctx.badRequest(`Erreur: ${error.message}`);
      }
    },

    async update(ctx) {
      try {
        const { id: documentId } = ctx.params;
        const { blocks, ...rest } = ctx.request.body.data;
        const findPage = await strapi.query("api::page.page").findOne({
          where: { documentId },
          populate: {
            page_content: true,
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
        const page_content = findPage?.page_content?.id;
        if (page_content && blocks) {
          // If blocks are provided, we do a full rewrite of the blocks
          // First, delete all existing blocks for the page
          const existingBlocks = await strapi
            .query("api::block.block")
            .findMany({
              where: {
                page: {
                  id: page_content,
                },
              },
              populate: {
                page: true,
              },
            });
          console.log("Existing blocks to delete:", existingBlocks.length);
          for (const block of existingBlocks) {
            await strapi.query("api::block.block").delete({
              where: { documentId: block.documentId },
            });
          }
          // Then, recreate the blocks from scratch
          let i = 1;
          for (const block of blocks) {
            const { children, ...blockWithoutChildren } = block;
            const newBlock = await strapi.query("api::block.block").create({
              data: {
                order: i,
                data: blockWithoutChildren,
                page: page_content,
              },
              populate: {
                page: true,
              },
            });
            // Recursively add children blocks
            if (children && children.length > 0) {
              let j = 1;
              for (const child of children) {
                await addBlockRecursively(child, newBlock.id, j);
                j++;
              }
            }
            i++;
          }
        }
        const updatedPage = await strapi.query("api::page.page").update({
          where: { documentId },
          data: {
            ...rest,
          },
          populate: {
            website: true,
            page_content: true,
          },
        });
        return ctx.send(updatedPage);
      } catch (error) {
        console.log(error);
        return ctx.badRequest(`Erreur: ${error.message}`);
      }
    },
  })
);
