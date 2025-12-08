"use client";

import useRefreshPage from "@/hooks/use-refresh-page";
import { generateUrlAlias } from "@/lib/alias";
import { usePageStore } from "@/stores/page";
import { PageItem } from "@/stores/page/type";
import { useSiteStore } from "@/stores/site";
import { useTranslationStore } from "@/stores/translation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../utils/Button";
import { Input } from "../utils/input";

export default function Informations() {
  const { site } = useSiteStore();
  const { page, updatePage } = usePageStore();
  const { t } = useTranslationStore();
  const trad = t?.setting?.information;
  const trad2 = t?.setting?.seo;

  const getParentPath = () => {
    let parentPath = "/";
    let docParent = page?.parent;
    while (docParent && docParent !== null) {
      parentPath += `${(docParent as PageItem).path}/`;
      docParent = (docParent as PageItem).parent;
    }
    return parentPath;
  };
  const [form, setForm] = useState<{
    title?: string;
    keywords?: string;
    description?: string;
    path?: string;
    published?: boolean;
  }>({
    title: page?.title,
    keywords: page?.keywords,
    description: page?.description,
    path: page?.path,
    published: page?.published,
  });
  const router = useRouter();
  const token = sessionStorage.getItem("token");
  const { refreshPage } = useRefreshPage();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;
    const { path, published, description, keywords, title } = form;
    let realPath = generateUrlAlias(path ?? "");
    try {
      if (!page) return;
      await updatePage(page.documentId, {
        title: title ?? "",
        description: description ?? "",
        keywords: keywords ?? "",
        published: published ?? true,
      });
      await refreshPage();
      toast.success("Document mis à jour avec succès");
      router.push(`${getParentPath()}${realPath ?? ""}?token=${token}`);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour du document");
    }
  };
  useEffect(() => {
    setForm({
      path: page?.path,
      published: page?.published,
      title: page?.title,
      keywords: page?.keywords,
      description: page?.description,
    });
  }, [page]);
  return (
    <div>
      <form className="flex flex-col items-center p-4" onSubmit={handleSubmit}>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            {trad2?.pageTitle}
          </label>
          <Input
            name="title"
            id="title"
            defaultValue={form?.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
            }}
          />
        </div>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="keywords"
            className="block text-sm font-medium text-gray-700"
          >
            {trad2?.keywords}
          </label>
          <Input
            name="keywords"
            id="keywords"
            defaultValue={form?.keywords}
            onChange={(e) => {
              setForm({ ...form, keywords: e.target.value });
            }}
          />
        </div>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            {trad2?.description}
          </label>
          <Input
            name="description"
            id="description"
            defaultValue={form?.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
            }}
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="published"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.published}
          </label>
          <input
            type="checkbox"
            id="published"
            name="published"
            defaultChecked={form?.published}
            className="w-fit accent-primary"
            onChange={(e) => {
              setForm({ ...form, published: e.target.checked });
            }}
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="has_children"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.has_children}
          </label>
          <input
            type="checkbox"
            id="has_children"
            name="has_children"
            defaultChecked={page?.children && page?.children.length > 0}
            disabled={true}
            className="w-fit accent-primary"
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-start gap-2">
          <label
            htmlFor="path"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.path}
          </label>
          <input
            type="text"
            id="path"
            name="path"
            className="w-fit text-sm accent-primary"
            defaultValue={page?.path}
            disabled={true}
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-start gap-2">
          <label
            htmlFor="parentId"
            className="block text-sm font-medium text-gray-700"
          >
            ParentID
          </label>
          <input
            type="text"
            id="parentId"
            name="parentId"
            className="w-fit text-sm accent-primary"
            defaultValue={page?.parent?.id ?? ""}
            disabled={true}
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-start gap-2">
          <label
            htmlFor="siteID"
            className="block text-sm font-medium text-gray-700"
          >
            SiteID
          </label>
          <input
            type="text"
            id="siteID"
            name="siteID"
            className="w-fit text-sm accent-primary"
            defaultValue={page?.id ?? ""}
            disabled={true}
          />
        </div>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-start gap-2">
          <label
            htmlFor="documentId"
            className="block text-sm font-medium text-gray-700"
          >
            GUID
          </label>
          <input
            type="text"
            id="documentId"
            name="documentId"
            className="w-fit text-sm accent-primary"
            defaultValue={page?.documentId ?? ""}
            disabled={true}
          />
        </div>
        <div className="mt-4 w-full max-w-sm">
          <Button type="submit" className="w-full justify-center text-center">
            {t?.setting?.saveBtn}
          </Button>
        </div>
      </form>
    </div>
  );
}
