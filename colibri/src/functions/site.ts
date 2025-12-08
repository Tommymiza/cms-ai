import useRefreshPage from "@/hooks/use-refresh-page";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function siteTool() {
  const { updateSite } = useSiteStore();
  const { refreshPage } = useRefreshPage();

  const updateSiteTool = async (tool: any) => {
    try {
      const { documentId, ...data } = tool.input;
      const result = await updateSite(documentId, data);
      await refreshPage();
      toast.success("Site mis à jour avec succès");
      return result;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du site:", error);
      toast.error("Erreur lors de la mise à jour du site");
      throw error;
    }
  };

  return { updateSiteTool };
}
