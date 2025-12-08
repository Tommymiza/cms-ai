"use client";

import { getHostOnClientSide } from "@/lib/gethost";
import { usePageStore } from "@/stores/page";
import { useSiteStore } from "@/stores/site";
import { Culture } from "@/stores/site/type";
import { useTranslationStore } from "@/stores/translation";
import { AxiosError } from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type UseSiteReturnType = {
  isLoading: boolean;
};

export default function useSite(): UseSiteReturnType {
  const { getSiteByUrl, site, setToken, setTenant } = useSiteStore(
    (state) => state
  );
  const [isLoading, setIsLoading] = useState(true);
  const { getTranslation } = useTranslationStore();
  const { setPage, page } = usePageStore();
  const router = useRouter();
  const params = useSearchParams();
  const pathToken = params.get("token");
  const pathTenant = params.get("tenant");

  const pathname = usePathname();

  useEffect(() => {
    if (pathToken) {
      sessionStorage.setItem("token", pathToken);
      setToken(pathToken);
    } else {
      const token = sessionStorage.getItem("token");
      setToken(token);
    }
  }, [pathToken]);

  useEffect(() => {
    if (pathTenant) {
      console.log("Setting tenant from path:", pathTenant);
      const tenantNumber = Number(pathTenant);
      sessionStorage.setItem("tenant", tenantNumber.toString());
      setTenant(tenantNumber);
    } else {
      const tenant = sessionStorage.getItem("tenant");
      if (tenant) {
        setTenant(Number(tenant));
      } else {
        setTenant(null);
      }
    }
  }, [pathTenant]);

  useEffect(() => {
    setIsLoading(true);
    const fetchSiteData = async () => {
      try {
        const domain = getHostOnClientSide();
        await getSiteByUrl({ url: domain });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code === "ERR_BAD_REQUEST") {
            router.push("/bad-request");
          }
        }
        console.error(
          "Erreur lors de la récupération des données du site :",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchSiteData();
  }, []);

  useEffect(() => {
    if (site) {
      console.log(site);
      document.documentElement.setAttribute(
        "lang",
        site.default_visitor_culture.code
      );
      const page = site.pages.find((p) => p.path === pathname);
      if (page) {
        setPage({ ...page });
      } else {
        setPage(null);
      }
    }
  }, [site, pathname]);

  useEffect(() => {
    if (
      site?.default_visitor_culture &&
      (site.default_visitor_culture as Culture).code
    ) {
      getTranslation((site.default_visitor_culture as Culture).code);
    }
  }, [site?.default_visitor_culture]);

  useEffect(() => {
    if (page) {
      document.title = page.title;
      let metaDescription = document.querySelector('meta[name="description"]');

      // If the meta description tag doesn't exist, create it
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", page.description);
      // Get the existing meta keywords tag
      let metaKeywords = document.querySelector('meta[name="keywords"]');

      // If the meta keywords tag doesn't exist, create it
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.setAttribute("name", "keywords");
        document.head.appendChild(metaKeywords);
      }

      // Set the content of the meta keywords
      metaKeywords.setAttribute("content", page.keywords);
    }
  }, [page]);

  useEffect(() => {
    const style = document.createElement("style");
    if (site) {
      const existing = document.querySelector("style[data-dynamic-style]");
      if (existing) existing.remove();

      // Crée une nouvelle balise <style>
      style.setAttribute("data-dynamic-style", "true");
      style.textContent = site.style;

      // Ajoute au <head>
      document.head.appendChild(style);
    }
    return () => {
      style.remove();
    };
  }, [site]);
  return { isLoading };
}
