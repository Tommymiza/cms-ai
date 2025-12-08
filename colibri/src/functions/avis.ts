import { useAvisStore } from "@/stores/avis";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function avisTool() {
  const {
    createAvis,
    updateAvis: updateAvisStore,
    deleteAvis: deleteAvisStore,
    searchAvis,
  } = useAvisStore();

  const { site } = useSiteStore();
  const addAvis = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const avis = await createAvis(args);
      toast.success("L’avis a bien été ajouté");
      return avis;
    } catch (error: any) {
      console.log(error);
      // toast.error("Une erreur est survenue lors de l’ajout de l’avis");
      throw new Error("Une erreur est survenue lors de l’ajout de l’avis");
    }
  };

  const updateAvis = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateAvisStore({ documentId, data: rest });
      toast.success("L’avis a bien été modifié");
    } catch (error: any) {
      console.log(error);
      // toast.error("Une erreur est survenue lors de la modification de l’avis");
      throw new Error(
        "Une erreur s'est produite lors de la modification de l'avis"
      );
    }
  };

  const deleteAvis = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deleteAvisStore(args.documentId);
      toast.success("L’avis a bien été supprimé");
    } catch (error: any) {
      console.log(error);
      // toast.error("Une erreur est survenue lors de la suppression de l’avis");
      throw new Error(
        "Une erreur s'est produite lors de la suppression de l'avis"
      );
    }
  };

  const retrieveAvis = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const aviss = await searchAvis(args.search, site?.id);
      return aviss;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun avis trouvé");
    }
  };

  return {
    addAvis,
    updateAvis,
    deleteAvis,
    retrieveAvis,
  };
}
