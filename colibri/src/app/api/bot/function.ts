import axios from "@/lib/axios";
import { Site } from "@/stores/site/type";

export const getSite = async (token: string, host: string) => {
  const site: Site = (
    await axios.get("/sites/byUrl", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        url: host,
      },
    })
  ).data.data;
  return site;
};
