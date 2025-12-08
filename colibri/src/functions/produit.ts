import { useProduitStore } from "@/stores/produit";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function produitTool() {
  const {
    createProduit,
    updateProduit: updateProduitStore,
    deleteProduit: deleteProduitStore,
    searchProduit,
  } = useProduitStore();
  const { site } = useSiteStore();

  const addProduit = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const produit = await createProduit(args);
      toast.success("Le produit a bien été ajouté");
      return produit;
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l’ajout du produit");
      throw new Error("Une erreur est survenue lors de l’ajout du produit");
    }
  };

  const updateProduit = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateProduitStore({ documentId, data: rest });
      toast.success("Le produit a bien été modifié");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la modification du produit");
      throw new Error(
        "Une erreur s'est produite lors de la modification du produit"
      );
    }
  };

  const deleteProduit = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deleteProduitStore(args.documentId);
      toast.success("Le produit a bien été supprimé");
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la suppression du produit");
      throw new Error(
        "Une erreur s'est produite lors de la suppression du produit"
      );
    }
  };

  const retrieveProduit = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const produits = await searchProduit(args.search, site?.id);
      return produits;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun produit trouvé");
    }
  };

  return {
    addProduit,
    updateProduit,
    deleteProduit,
    retrieveProduit,
  };
}
