import { MeiliSearch } from "meilisearch";

export function resolveMeiliInstance(
  userCountry: string,
  plan: "free" | "premium"
): string {
  return process.env.MEILI_HOST;
}

export function getMeiliClient(userCountry: string, plan: "free" | "premium") {
  const host = resolveMeiliInstance(userCountry, plan);
  return new MeiliSearch({
    host,
    apiKey: process.env.MEILI_MASTER_KEY,
  });
}

export async function getSiteIndex(
  client: MeiliSearch,
  siteId: string,
  contentType: string
) {
  const indexName = `site_${siteId}_${contentType}`;
  return client.index(indexName);
}