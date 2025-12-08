"use client";
import { useSiteStore } from "@/stores/site";
import RenderFooterBlock from "./render-footer-block";

export default function Header() {
  const { site } = useSiteStore();
  if (!site) return null;
  return <RenderFooterBlock block={site?.header} />;
}
