import { ImageSchema } from "@/schemas/image";
import { tool } from "ai";

export const generateImageTool = tool({
  name: "create_image",
  description:
    "Permet de générer une image à partir d'une description textuelle en utilisant l'intelligence artificielle",
  inputSchema: ImageSchema,
});
