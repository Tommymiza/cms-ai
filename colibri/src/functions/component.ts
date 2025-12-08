import { useComponentStore } from "@/stores/component";
import { toast } from "sonner";

export default function componentTool() {
  const { createComponent, updateComponent } = useComponentStore();

  const addDynamicComponent = async (toolCall: any) => {
    const args = toolCall.input;
    try {
      const avis = await createComponent(args);
      toast.success("Le composant a bien été ajouté");
      return avis;
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l’ajout du composant");
      throw new Error("Une erreur est survenue lors de l’ajout du composant");
    }
  };

  const updateDynamicComponent = async (toolCall: any) => {
    const { documentId, ...rest } = toolCall.input;
    try {
      await updateComponent({ documentId, data: rest });
      toast.success("Le composant a bien été modifié");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la modification du composant"
      );
      throw new Error(
        "Une erreur s'est produite lors de la modification du composant"
      );
    }
  };

  return { addDynamicComponent, updateDynamicComponent };
}
