import axios from "@/lib/axios";
import { getHostOnClientSide } from "@/lib/gethost";
import { AxiosResponse } from "axios";
import { stringify } from "qs";
import { create } from "zustand";
import { Action, Site, State } from "./type";

export const useSiteStore = create<State & Action>((set, get) => ({
  loading: false,
  site: null,
  isPreview: false,
  token: null,
  tenant: null,
  setTenant: (tenant: number | null) => set({ tenant }),
  setToken: (token: string | null) => set({ token }),
  getSiteByUrl: async (param: Record<string, any>) => {
    try {
      if (typeof window !== "undefined")
        set({ token: window.sessionStorage.getItem("token") });
      set({ loading: true });

      let token;
      let tenant;
      const queryString =
        typeof window !== "undefined" ? window.location.search : undefined;
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        token = urlParams.get("token");
        tenant = urlParams.get("tenant");
      }
      if (token) {
        typeof window !== "undefined" &&
          window.sessionStorage.setItem("token", token);
      }
      if (tenant) {
        typeof window !== "undefined" &&
          window.sessionStorage.setItem("tenant", tenant);
      }
      const query = stringify({
        ...param,
      });
      const site: AxiosResponse<{ data: Site }> = await axios.get(
        `/sites/byUrl?${query}`
      );
      const domain = getHostOnClientSide();
      if (domain?.includes("preview")) {
        const { isPreview } = get();
        if (!isPreview) {
          set({ isPreview: true });
        }
      }
      const siteData = site.data.data;
      set({
        site: {
          ...siteData,
        },
      });
      return site.data.data;
    } catch (error) {
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateSite: async (documentId, site) => {
    try {
      set({ loading: true });
      const token = window.sessionStorage.getItem("token");
      const response = await axios.put(
        `/sites/${documentId}`,
        { data: site },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("error : ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  saveSite: async (site) => {
    try {
      set({ loading: true });
      const token = window.sessionStorage.getItem("token");
      await axios.post(`/sites/saveSite`, site, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("error : ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  returnSite: async (site) => {
    try {
      set({ loading: true });
      const token = window.sessionStorage.getItem("token");
      await axios.post(`/sites/returnSite`, site, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("error : ", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
