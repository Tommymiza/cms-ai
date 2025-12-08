import { UpdateSiteSchema } from "@/schemas/update/site";
import { tool } from "ai";

export const updateSiteTool = tool({
  name: "update_site",
  description:
    "Permet de mettre à jour les informations générales du site web (logo, description, slogan, coordonnées, configuration, header, footer)",
  inputSchema: UpdateSiteSchema,
});
