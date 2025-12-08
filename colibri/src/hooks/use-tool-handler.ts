import avisTool from "@/functions/avis";
import blockTool from "@/functions/block";
import bureauTool from "@/functions/bureau";
import componentTool from "@/functions/component";
import etudeTool from "@/functions/etude";
import pageTool from "@/functions/page";
import partnerTool from "@/functions/partenaire";
import produitTool from "@/functions/produit";
import produitCategoryTool from "@/functions/produit-category";
import serviceTool from "@/functions/service";
import siteTool from "@/functions/site";
import utilsTool from "@/functions/utils";
import useRefreshPage from "@/hooks/use-refresh-page";
import { useSiteStore } from "@/stores/site";

export default function useToolHandler(
  setLoadingText: (text: string | null) => void,
  scroll: () => void
) {
  const { token } = useSiteStore();

  const { refreshPage } = useRefreshPage();

  const { addService, deleteService, updateService } = serviceTool();

  const { addProduit, deleteProduit, updateProduit } = produitTool();
  const { addProduitCategory, deleteProduitCategory, updateProduitCategory } =
    produitCategoryTool();

  const { addAvis, updateAvis, deleteAvis } = avisTool();

  const { addEtude, updateEtude, deleteEtude } = etudeTool();

  const { addBureau, updateBureau, deleteBureau } = bureauTool();

  const {
    addPartenaire,
    deletePartenaire,
    searchPartenaireLogo,
    updatePartenaire,
  } = partnerTool();

  const { updateSiteTool } = siteTool();

  const { createPageTool, updatePageTool, deletePageTool } = pageTool();

  const { generateImage } = utilsTool();

  const { addDynamicComponent, updateDynamicComponent } = componentTool();

  const { createBlock, updateBlock, deleteBlock } = blockTool();

  const handleToolCall = async ({
    toolCall,
    addToolResult,
  }: {
    toolCall: { toolName: string; toolCallId: string; input: any };
    addToolResult: <TOOL extends string>({
      tool,
      toolCallId,
      output,
    }: {
      tool: TOOL;
      toolCallId: string;
      output: unknown;
    }) => Promise<void>;
  }) => {
    const tool = toolCall;
    try {
      const finishTool = async (
        toolData: { toolName: string; toolCallId: string },
        result: any = true
      ) => {
        await addToolResult({
          tool: toolData.toolName,
          output: result,
          toolCallId: toolData.toolCallId,
        });
      };

      switch (tool.toolName) {
        case "update_site":
          setLoadingText("Mise à jour du site en cours...");
          await new Promise((r) => setTimeout(r, 500));
          scroll();
          await updateSiteTool(tool);
          setLoadingText(null);
          finishTool(tool);
          break;

        case "update_page":
          setLoadingText("Mise à jour de la page en cours...");
          await new Promise((r) => setTimeout(r, 500));
          scroll();
          await updatePageTool(tool);
          setLoadingText(null);
          finishTool(tool);
          await refreshPage();
          break;

        case "create_image":
          setLoadingText("Génération de l'image en cours...");
          await new Promise((r) => setTimeout(r, 500));
          scroll();
          const response = await generateImage(tool);
          setLoadingText(null);
          finishTool(tool, response);
          break;
        case "add_new_page":
          setLoadingText("Création de la page en cours...");
          await new Promise((r) => setTimeout(r, 500));
          scroll();
          const newPage = await createPageTool(tool);
          setLoadingText(null);
          finishTool(tool, `[${newPage?.title}](${newPage?.path}`);
          break;
        case "delete_page":
          setLoadingText("Suppression de la page en cours...");
          await new Promise((r) => setTimeout(r, 500));
          await deletePageTool(tool);
          setLoadingText(null);
          finishTool(tool);
          break;
        case "add_block_item":
          const block = await createBlock(tool);
          finishTool(tool, block);
          await refreshPage();
          break;
        case "update_block_item":
          await updateBlock(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_block_item":
          await deleteBlock(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_service":
          const service = await addService(tool);
          finishTool(tool, service);
          await refreshPage();
          break;
        case "update_service":
          await updateService(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_service":
          await deleteService(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_product":
          const produit = await addProduit(tool);
          finishTool(tool, produit);
          await refreshPage();
          break;
        case "update_product":
          await updateProduit(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_product":
          await deleteProduit(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_product_category":
          const produitCategory = await addProduitCategory(tool);
          finishTool(tool, produitCategory);
          await refreshPage();
          break;
        case "update_product_cagegory":
          await updateProduitCategory(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_product_category":
          await deleteProduitCategory(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_avis":
          const avis = await addAvis(tool);
          finishTool(tool, avis);
          await refreshPage();
          break;
        case "update_avis":
          await updateAvis(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_avis":
          await deleteAvis(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_etude":
          const etude = await addEtude(tool);
          finishTool(tool, etude);
          await refreshPage();
          break;
        case "update_etude":
          await updateEtude(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_etude":
          await deleteEtude(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_bureau":
          const bureau = await addBureau(tool);
          finishTool(tool, bureau);
          await refreshPage();
          break;
        case "update_bureau":
          await updateBureau(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_bureau":
          await deleteBureau(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_partner":
          const partner = await addPartenaire(tool);
          finishTool(tool, partner);
          await refreshPage();
          break;
        case "search_logo_partner":
          const logo = await searchPartenaireLogo(tool);
          finishTool(tool, logo);
          break;
        case "update_partner":
          await updatePartenaire(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "delete_partner":
          await deletePartenaire(tool);
          finishTool(tool);
          await refreshPage();
          break;
        case "add_dynamic_component":
          const component = await addDynamicComponent(tool);
          finishTool(tool, component);
          await refreshPage();
          break;
        case "update_dynamic_component":
          await updateDynamicComponent(tool);
          finishTool(tool);
          await refreshPage();
          break;
        default:
          finishTool(tool, null);
          break;
      }
    } catch (error) {
      console.log(error);
      // toast.error(
      //   `Une erreur est survenue lors de l'exécution de la commande ${tool.toolName}`
      // );
      await addToolResult({
        tool: tool.toolName,
        output: `Erreur lors de l'exécution de la commande ${tool.toolName}`,
        toolCallId: tool.toolCallId,
      });
    }
  };

  return { handleToolCall };
}
