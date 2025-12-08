import { useBlockStore } from "@/stores/block";

export default function blockTool() {
  const { createBlock, updateBlock, deleteBlock } = useBlockStore();

  const createBlockTool = async (toolCall: any) => {
    try {
      const args = toolCall.input;
      const block = await createBlock(args);
      return block;
    } catch (error) {
      console.log(error);
      throw new Error("Une erreur est survenue lors de la création du block");
    }
  };

  const updateBlockTool = async (toolCall: any) => {
    try {
      const args = toolCall.input;
      const blocks = args.blocks;
      const promises = blocks.map(async (block: any) => {
        const { documentId, ...data } = block;
        return await updateBlock(documentId, data);
      });
      await Promise.all(promises);
      return "Block mis à jour avec succès";
    } catch (error) {
      console.log(error);
      throw new Error(
        "Une erreur est survenue lors de la modification du block"
      );
    }
  };

  const deleteBlockTool = async (toolCall: any) => {
    try {
      const args = toolCall.input;
      await deleteBlock(args.documentId);
    } catch (error) {
      console.log(error);
      throw new Error(
        "Une erreur est survenue lors de la suppression du block"
      );
    }
  };

  return {
    createBlock: createBlockTool,
    updateBlock: updateBlockTool,
    deleteBlock: deleteBlockTool,
  };
}
