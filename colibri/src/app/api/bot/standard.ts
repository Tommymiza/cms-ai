import axios from "@/lib/axios";
import { polaris } from "@/lib/model";
import { tokenCounter } from "@/lib/token-counter";
import {
  addAvisTool,
  addBureauTool,
  addEtudeTool,
  addPartenaireTool,
  addProduitCategoryTool,
  addProduitTool,
  addServiceTool,
  createPageTool,
  deleteAvisTool,
  deleteBureauTool,
  deleteEtudeTool,
  deletePageTool,
  deletePartenaireTool,
  deleteProduitCategoryTool,
  deleteProduitTool,
  deleteServiceTool,
  generateImageTool,
  searchPartenaireLogoTool,
  updateAvisTool,
  updateBureauTool,
  updateEtudeTool,
  updatePageTool,
  updatePartenaireTool,
  updateProduitCategoryTool,
  updateProduitTool,
  updateServiceTool,
} from "@/tools";
import {
  createBlockTool,
  deleteBlockTool,
  updateBlockTool,
} from "@/tools/block";
import {
  createDynamicComponentTool,
  updateDynamicComponentTool,
} from "@/tools/component";
import { updateSiteTool } from "@/tools/site";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { NextResponse } from "next/server";

export async function standard({ messages, site, page, token, tenant }: any) {
  const systemMessage = `
    <context_gathering>
      Website: ${JSON.stringify(site)}
      Current page: ${JSON.stringify(page)}
    </context_gathering>
    <task>
      You are an AI assistant integrated into a website builder platform. Your task is to help users manage and update their website content effectively.
      Always refer to the current page and don't use the other pages unless explicitly told to do so.
      Never show a code block in your response.
      Header and footer are managed globally, so it is on the site property, not on page. Use update_site tool to update header and footer.
      Some pages may have a parent-child relationship; the "parent" field indicates the parent page's ID, or null if there is no parent.
      You can may create a page with parent field to set a parent page.
      Don't use script tag in the page content.
      For all props use JSX syntax; like className instead of class, htmlFor instead of for, etc. Don't use action attribute like: onClick="someFunction()", onBlur="".
      Don't forget to add type (HTML tag) for a block.
      Use Tailwind CSS for styling and ensure the design is modern and responsive.
      After new page creation, provide the user with a direct link to the newly created page in your response with markdown format [alt](link).
      A block contains documentId and ID, use them properly.
      When adding a block item, ensure that you specify either a parent block ID or a page ID, but not both.
      You can perform actions such as creating images, updating site properties, and modifying page blocks using the tools provided.
      Be sure on input data validation schema before using a tool.
      For animation, use the style props to add css animation properties.
      Always ensure that your responses are concise and relevant to the user's requests.
      Don't use an external image url, use the create_image tool or ask to the user to upload an image.
      After generating image, always provide the user with a direct link to the newly created image in your response with markdown format ![alt](link).
    </task>
    `;
  const promptToken = tokenCounter(systemMessage, "gpt-5");
  const tokenCount = tokenCounter(messages.join(" "), "gpt-5");
  const totalInputToken = promptToken + tokenCount;

  console.log("tenant  in payload", tenant);
  console.log("token  in payload", token);
  try {
    const response = await axios.post(
      "/token-histories",
      {
        data: {
          token_amount: totalInputToken,
          model: "openai/gpt5",
          type: "input_token",
          tenant,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success === false) {
      return NextResponse.json(
        {
          message: "Not enough balance",
        },
        {
          status: 403,
        }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        message: "Not enough balance",
      },
      {
        status: 403,
      }
    );
  }

  const result = streamText({
    model: polaris,
    system: systemMessage,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(20),
    tools: {
      // Site tools
      update_site: updateSiteTool,

      // Page tools
      add_new_page: createPageTool,
      update_page: updatePageTool,
      delete_page: deletePageTool,

      add_block_item: createBlockTool,
      update_block_item: updateBlockTool,
      delete_block_item: deleteBlockTool,

      // Product tools
      add_product: addProduitTool,
      update_product: updateProduitTool,
      delete_product: deleteProduitTool,

      // Product category tools
      add_product_category: addProduitCategoryTool,
      update_product_cagegory: updateProduitCategoryTool,
      delete_product_category: deleteProduitCategoryTool,

      // Service tools
      add_service: addServiceTool,
      update_service: updateServiceTool,
      delete_service: deleteServiceTool,

      // Avis (Reviews) tools
      add_avis: addAvisTool,
      update_avis: updateAvisTool,
      delete_avis: deleteAvisTool,

      // Etude (Case study) tools
      add_etude: addEtudeTool,
      update_etude: updateEtudeTool,
      delete_etude: deleteEtudeTool,

      // Bureau (Office) tools
      add_bureau: addBureauTool,
      update_bureau: updateBureauTool,
      delete_bureau: deleteBureauTool,

      // Partner tools
      add_partner: addPartenaireTool,
      update_partner: updatePartenaireTool,
      delete_partner: deletePartenaireTool,
      search_logo_partner: searchPartenaireLogoTool,

      // Utility tools
      create_image: generateImageTool,

      // Dynamic component tools
      add_dynamic_component: createDynamicComponentTool,
      update_dynamic_component: updateDynamicComponentTool,
    },
  });
  return result.toUIMessageStreamResponse();
}
