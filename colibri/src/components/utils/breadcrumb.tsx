"use client";
import { useSiteStore } from "@/stores/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BiChevronRight } from "react-icons/bi";

export default function BreadCrumbs() {
  const { site, token } = useSiteStore();
  const pathname = usePathname();

  const hierarchies = useMemo(() => {
    const paths = pathname.split("/");
    if (site && site.pages) {
      return paths
        .map((p, i, arr) => {
          let currentPath = arr.slice(0, i + 1).join("/");
          if (currentPath) {
            const hierarchy = site.pages?.find((h) => h.path === currentPath);
            return {
              title: hierarchy?.title || p,
              path: `${hierarchy?.path}?token=${token}`,
            };
          }
          return null;
        })
        .filter((p) => Boolean(p));
    }
    return [];
  }, [site, pathname, token]);
  return (
    <div className="flex items-center gap-2">
      {hierarchies.length > 1 &&
        hierarchies.map((h, i) => (
          <Link
            key={h?.path}
            href={h?.path ?? ""}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {h?.title}
            {i < hierarchies.length - 1 && (
              <BiChevronRight className="inline size-4" />
            )}
          </Link>
        ))}
    </div>
  );
}
