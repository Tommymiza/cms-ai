export const addDefaultData = async (siteId: number, defaultData: any) => {
  try {
    const { lists, pages, components } = defaultData;
    if (components) {
      for (const component of components) {
        const keys = Object.keys(component);
        for (const key of keys) {
          const comp = component[key];
          await strapi.query("api::component.component").create({
            data: {
              nom: key,
              block: comp,
              website: siteId,
            },
            populate: {
              website: true,
            },
          });
        }
      }
    }
    if (lists) {
      for (const list of lists) {
        const newList = await strapi.query("api::list.list").create({
          data: {
            list_key: list.list_key,
            website: siteId,
          },
          populate: {
            website: true,
          },
        });
        await strapi.query("api::list-schema.list-schema").create({
          data: {
            type: newList.id,
            description: list.schema.description,
            version: list.schema.version,
            schema: {
              fields: list.schema.fields,
              breaking: list.breaking,
            },
          },
          populate: {
            list: true,
          },
        });
        const items = list.items;
        for (const item of items) {
          const { id, ...rest } = item;
          const newItem = await strapi
            .query("api::list-item.list-item")
            .create({
              data: {
                data: rest,
                type: newList.id,
              },
              populate: {
                type: true,
              },
            });
          pages.forEach((page: any) => {
            page.blocks = Array.isArray(page.blocks)
              ? page.blocks.map((block: any) =>
                  updateDataId(block, list.list_key, id, newItem.id)
                )
              : updateDataId(page.blocks, list.list_key, id, newItem.id);
            return page;
          });
        }
      }
    }

    if (pages) {
      console.log("start creating pages");
      const pageIdMapping = new Map();

      // Trier les pages : d'abord celles sans parent, puis les autres
      const sortedPages = pages.sort((a, b) => {
        if (!a.parent_id) return -1;
        if (!b.parent_id) return 1;
        return 0;
      });
      for (const page of sortedPages) {
        const { id, blocks, parent_id, ...rest } = page;
        const newPageContent = await strapi
          .query("api::page-content.page-content")
          .create({
            data: {},
          });
        console.log("new page content created", newPageContent.id);
        const newPage = await strapi.query("api::page.page").create({
          data: {
            ...rest,
            parent: parent_id ? pageIdMapping.get(parent_id) : null,
            page_content: newPageContent.id,
            website: siteId,
          },
          populate: {
            website: true,
            parent: true,
          },
        });
        pageIdMapping.set(id, newPage.id);

        let i = 1;
        if (Array.isArray(blocks)) {
          for (const block of blocks) {
            const { children, ...blockWithoutChildren } = block;
            const newBlock = await strapi.query("api::block.block").create({
              data: {
                order: i,
                data: blockWithoutChildren,
                page: newPageContent.id,
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
        } else {
          const { children, ...blockWithoutChildren } = blocks;
          const newBlock = await strapi.query("api::block.block").create({
            data: {
              order: i,
              data: blockWithoutChildren,
              page: newPageContent.id,
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
        }
      }
    }
    console.log("page created");
  } catch (error) {
    console.log("error create new doc and new data template", error);
    throw error;
  }
};

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

function updateDataId(block: any, key: string, value: any, newValue: any): any {
  let updated = { ...block };

  if (updated.type === key) {
    if (updated.props && updated.props.dataId == value) {
      updated.props = {
        ...updated.props,
        dataId: newValue,
      };
    }
  }

  if (updated.children) {
    updated.children = updated.children.map((child) =>
      updateDataId(child, key, value, newValue)
    );
  }

  return updated;
}
