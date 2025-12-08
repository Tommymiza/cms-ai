import { useServiceStore } from "@/stores/service";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function serviceTool() {
  const {
    createService,
    updateService: updateServiceStore,
    deleteService: deleteServiceStore,
    searchService,
  } = useServiceStore();
  const { site } = useSiteStore();
  const addService = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const service = await createService(args);
      toast.success("Le service a bien été ajouté");
      return service;
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l’ajout du service");
      throw new Error("Une erreur est survenue lors de l’ajout du service");
    }
  };

  const updateService = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateServiceStore({ documentId, data: rest });
      toast.success("Le service a bien été modifié");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la modification du service");
      throw new Error(
        "Une erreur est survenue lors de la modification du service"
      );
    }
  };

  const deleteService = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deleteServiceStore(args.documentId);
      toast.success("Le service a bien été supprimé");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la suppression du service");
      throw new Error(
        "Une erreur s'est produite lors de la suppression du service"
      );
    }
  };

  const retrieveService = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const services = await searchService(args.search, site?.id);
      return services;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun service trouvé");
    }
  };

  return {
    addService,
    updateService,
    deleteService,
    retrieveService,
  };
}
