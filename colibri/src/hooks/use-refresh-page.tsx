import { getHostOnClientSide } from "@/lib/gethost";
import { useSiteStore } from "@/stores/site";
import { Site } from "@/stores/site/type";

export default function useRefreshPage() {
  const { getSiteByUrl } = useSiteStore();

  const refreshPage = async (): Promise<Site> => {
    const domain = getHostOnClientSide();
    const lastSite = await getSiteByUrl({ url: domain });
    return lastSite;
  };
  return {
    refreshPage,
  };
}
