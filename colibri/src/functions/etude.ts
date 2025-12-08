import { useEtudeStore } from "@/stores/etude";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function etudeTool() {
  const {
    createEtude,
    updateEtude: updateEtudeStore,
    deleteEtude: deleteEtudeStore,
    searchEtude,
  } = useEtudeStore();

  const { site } = useSiteStore();
  const addEtude = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const etude = await createEtude(args);
      toast.success("L’étude a bien été ajoutée");
      return etude;
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l’ajout de l’étude");
      throw new Error("Une erreur est survenue lors de l’ajout de l’étude");
    }
  };

  const updateEtude = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateEtudeStore({ documentId, data: rest });
      toast.success("L’étude a bien été modifiée");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la modification de l’étude");
      throw new Error(
        "Une erreur s'est produite lors de la modification de l'étude"
      );
    }
  };

  const deleteEtude = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deleteEtudeStore(args.documentId);
      toast.success("L’étude a bien été supprimée");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la suppression de l’étude");
      throw new Error(
        "Une erreur s'est produite lors de la suppression de l'étude"
      );
    }
  };

  const retrieveEtude = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const etudes = await searchEtude(args.search, site?.id);
      return etudes;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucune étude trouvée");
    }
  };

  return {
    addEtude,
    updateEtude,
    deleteEtude,
    retrieveEtude,
  };
}
