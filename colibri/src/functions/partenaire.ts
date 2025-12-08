import { usePartenaireStore } from "@/stores/partenaire";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function partnerTool() {
  const {
    createPartenaire,
    searchLogo,
    updatePartenaire: updatePartenaireStore,
    deletePartenaire: deletePartenaireStore,
    searchPartenaire,
  } = usePartenaireStore();

  const { site } = useSiteStore();
  const addPartenaire = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const partenaire = await createPartenaire(args);
      toast.success("Le partenaire a bien été ajouté");
      return partenaire;
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l’ajout du partenaire");
      throw new Error("Une erreur est survenue lors de l’ajout du partenaire");
    }
  };

  const searchPartenaireLogo = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const partenaires = await searchLogo(args.search);
      if (partenaires.length === 0) {
        return "Aucun logo trouvé";
      }
      return partenaires[0].logo_url;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun partenaire");
    }
  };

  const updatePartenaire = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updatePartenaireStore({ documentId, data: rest });
      toast.success("Le partenaire a bien été modifié");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la modification du partenaire"
      );
      throw new Error(
        "Une erreur s'est produite lors de la modification du partenaire"
      );
    }
  };

  const deletePartenaire = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deletePartenaireStore(args.documentId);
      toast.success("Le partenaire a bien été supprimé");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la suppression du partenaire"
      );
      throw new Error(
        "Une erreur s'est produite lors de la suppression du partenaire"
      );
    }
  };

  const retrievePartenaire = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const partenaires = await searchPartenaire(args.search, site?.id);
      return partenaires;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun partenaire trouvé");
    }
  };

  return {
    addPartenaire,
    searchPartenaireLogo,
    updatePartenaire,
    deletePartenaire,
    retrievePartenaire,
  };
}
