import { useProduitCategoryStore } from "@/stores/produit-category";
import { useSiteStore } from "@/stores/site";
import { toast } from "sonner";

export default function produitCategoryTool() {
  const {
    createProduitCategory,
    updateProduitCategory: updateProduitCategoryStore,
    deleteProduitCategory: deleteProduitCategoryStore,
    searchProduitCategory,
  } = useProduitCategoryStore();
  const { site } = useSiteStore();

  const addProduitCategory = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const produitCategory = await createProduitCategory(args);
      toast.success("Le produit Category a bien été ajouté");
      return produitCategory;
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de l’ajout du produit Category"
      );
      throw new Error(
        "Une erreur est survenue lors de l’ajout du produit Category"
      );
    }
  };

  const updateProduitCategory = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateProduitCategoryStore({ documentId, data: rest });
      toast.success("Le produit Category a bien été modifié");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la modification du produit Category"
      );
      throw new Error(
        "Une erreur s'est produit lors de la modification du produit Category"
      );
    }
  };

  const deleteProduitCategory = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      await deleteProduitCategoryStore(args.documentId);
      toast.success("Le produit Category a bien été supprimé");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la suppression du produit Category"
      );
      throw new Error(
        "Une erreur s'est produit lors de la suppression du produit Category"
      );
    }
  };

  const retrieveProduitCategory = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const produitCategorys = await searchProduitCategory(
        args.search,
        site?.id
      );
      return produitCategorys;
    } catch (error: any) {
      console.log(error);
      throw new Error("Aucun produit Category trouvé");
    }
  };

  return {
    addProduitCategory,
    updateProduitCategory,
    deleteProduitCategory,
    retrieveProduitCategory,
  };
}
