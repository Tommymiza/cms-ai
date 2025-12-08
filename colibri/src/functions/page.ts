import useRefreshPage from "@/hooks/use-refresh-page";
import { usePageStore } from "@/stores/page";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function pageTool() {
  const { updatePage, createPage, deletePage } = usePageStore();
  const { refreshPage } = useRefreshPage();
  const { token, site } = useSiteStore();

  const updatePageTool = async (tool: any) => {
    try {
      const { documentId, ...rest } = tool.input;
      const result = await updatePage(documentId, rest);
      await refreshPage();
      toast.success("Page mis à jour avec succès");
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la page", error);
      toast.error("Erreur lors de la mise à jour de la page");
      throw error;
    }
  };

  const createPageTool = async (tool: any) => {
    try {
      let args = tool.input;
      if (!args.path.startsWith("/")) {
        args.path = `/${args.path}`;
      }
      if (!site) throw new Error("Site not found");
      const result = await createPage({ ...args });
      await refreshPage();
      toast.success("Page créée avec succès");
      return result;
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      toast.error("Erreur lors création de la page");
      throw error;
    }
  };

  const deletePageTool = async (tool: any) => {
    try {
      const { documentId } = tool.input;
      await deletePage(documentId);
      await refreshPage();
      toast.success("Page supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la page", error);
      toast.error("Erreur lors de la suppression de la page");
      throw error;
    }
  };

  return { createPageTool, updatePageTool, deletePageTool };
}
