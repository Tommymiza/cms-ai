import { CreateDynamicComponentSchema } from "@/schemas/create/dynamic-component";
import { UpdateDynamicComponentSchema } from "@/schemas/update/dynamic-component";
import { tool } from "ai";

export const createDynamicComponentTool = tool({
  name: "add_dynamic_component",
  description:
    "Permet de créer un composant dynamique réutilisable avec des propriétés personnalisées",
  inputSchema: CreateDynamicComponentSchema,
});

export const updateDynamicComponentTool = tool({
  name: "update_dynamic_component",
  description:
    "Permet de mettre à jour un composant dynamique existant avec de nouvelles propriétés ou fonctionnalités",
  inputSchema: UpdateDynamicComponentSchema,
});
