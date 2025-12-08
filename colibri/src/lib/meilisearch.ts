import { MeiliSearch } from "meilisearch";

export const meiliClient = new MeiliSearch({
  apiKey: process.env.NEXT_PUBLIC_MEILI_MASTER_KEY,
  host: process.env.NEXT_PUBLIC_MEILI_HOST || "",
});
