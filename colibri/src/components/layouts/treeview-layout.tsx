"use client";

import useRefreshPage from "@/hooks/use-refresh-page";
import { generateUrlAlias } from "@/lib/alias";
import { usePageStore } from "@/stores/page";
import { PageItem } from "@/stores/page/type";
import { useSiteStore } from "@/stores/site";
import { useTranslationStore } from "@/stores/translation";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BiChevronDown, BiPlus, BiTrash } from "react-icons/bi";
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import { toast } from "sonner";
import TreeviewDnd from "../settings/Treeview-dnd";
import { Button } from "../utils/Button";

export default function TreeviewLayout() {
  const [open, setOpen] = useState(false);
  const [openNew, setOpenNew] = useState<any>(null);
  const { refreshPage } = useRefreshPage();
  const { createPage, deletePage } = usePageStore();
  const { site, token } = useSiteStore();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: any;
  } | null>(null);
  const router = useRouter();
  const closeContextMenu = () => {
    setContextMenu(null);
  };
  const { t } = useTranslationStore();
  const trad = t?.page_config;

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const form: { [x: string]: string } = Object.fromEntries(
      formData.entries()
    ) as { [x: string]: string };
    try {
      if (!site) return;
      const alias = openNew?.data
        ? `${openNew?.data?.path}/${generateUrlAlias(form.title)}`
        : `/${generateUrlAlias(form.title)}`;
      const payload: Partial<PageItem> = {
        title: form.title,
        type: form.type as "standard" | "service" | "produit",
        parent: openNew?.data?.id || null,
        order: 0,
        description: "",
        published: true,
        path: alias,
        website: site.id,
        blocks: [],
      };
      await createPage(payload);
      toast.success("Page créée avec succès");
      setOpenNew(null);
      setOpen(false);
      await refreshPage();
      console.log(`${alias}?token=${token}`);
      router.push(`${alias}?token=${token}`);
    } catch (error) {
      console.error("Error creating new page:", error);
      toast.error("Erreur lors de la création de la page");
    }
  };

  const pathname = usePathname();

  const deleteChildren = async (node: PageItem) => {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        await deleteChildren(child);
        await deletePage(child.documentId);
      }
    }
    await deletePage(node.documentId);
  };

  const handleDelete = async (node: any) => {
    try {
      console.log("delete", node);
      await deleteChildren(node.data);
      const lastSite = await refreshPage();
      if (pathname.includes(node.data.path)) {
        router.push(`${lastSite.pages[0].path}?token=${token}`);
      }
      toast.success("Page supprimée avec succès");
      setContextMenu(null);
      setOpen(false);
    } catch (error) {
      console.log("Error deleting page:", error);
      toast.error("Erreur lors de la suppression de la page");
    }
  };

  return (
    <div className="fixed left-10 top-20 z-[100] text-gray-950">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          className="border border-gray-300 bg-transparent"
        >
          <HiMiniBars3CenterLeft className="h-6 w-6 text-[var(--tweeksy)]" />
        </Button>
        {/* <BreadCrumbs /> */}
      </div>
      <div
        className="relative z-40"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          aria-hidden="true"
          onClick={() => setOpen(false)}
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s 0.3s",
            display: open ? "block" : "none",
          }}
        ></div>

        <div
          className="fixed inset-0 w-[360px] overflow-hidden"
          style={{
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <div className="pointer-events-auto relative w-screen max-w-xs">
                <div className="absolute -right-10 top-0 -ml-8 flex pl-2 pt-4 sm:-ml-10 sm:pl-4">
                  <button
                    type="button"
                    className="focus:outline-hidden relative rounded-md text-white hover:text-white focus:ring-2 focus:ring-white"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-2.5"></span>
                    <span className="sr-only">Close panel</span>
                    <svg
                      className="size-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 py-2 sm:px-6">
                    <h2
                      className="mb-4 text-base font-semibold text-gray-900"
                      id="slide-over-title"
                    >
                      Pages
                    </h2>
                    <button
                      className="flex w-full items-center justify-center rounded-md py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                      onClick={() => setOpenNew({})}
                    >
                      <BiPlus className="mr-2 inline h-4 w-4" />
                      {trad?.new}
                    </button>
                  </div>
                  <hr />
                  <div
                    className="relative mt-4 flex-1 px-4 sm:px-6"
                    onClick={closeContextMenu}
                  >
                    <TreeviewDnd setContextMenu={setContextMenu} />
                    {contextMenu && (
                      <ul
                        style={{
                          position: "absolute",
                          top: contextMenu.y - 60,
                          left: contextMenu.x - 20,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          color: "white",
                          backdropFilter: "blur(5px)",
                          width: 200,
                          borderRadius: "4px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                          padding: "10px",
                          listStyle: "none",
                          margin: 0,
                        }}
                      >
                        <li
                          onClick={() => setOpenNew(contextMenu.node)}
                          className="cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-gray-700"
                        >
                          <BiPlus className="mr-2 inline h-4 w-4" />
                          {trad?.new}
                        </li>
                        <li
                          className="cursor-pointer rounded-md px-2 py-1 text-sm hover:bg-gray-700"
                          onClick={() => handleDelete(contextMenu.node)}
                        >
                          <BiTrash className="mr-2 inline h-4 w-4" />
                          {trad?.delete}
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={Boolean(openNew)}
        onClose={() => setOpenNew(null)}
        className="relative z-[5000]"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-2 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
            >
              <div>
                <div className="text-center">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {trad?.newTitle}
                  </DialogTitle>
                  <form className="mt-2" onSubmit={handleAdd}>
                    <div className="flex w-full flex-col items-start">
                      <label
                        htmlFor="title"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        {trad?.nom}
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="ex: Nom de la page"
                        className="block w-full rounded-md border bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      />
                    </div>

                    <div className="mb-4 flex w-full flex-col items-start gap-2">
                      <label
                        htmlFor="type"
                        className="block text-sm font-medium text-gray-900"
                      >
                        {trad?.type}
                      </label>
                      <div className="grid w-full grid-cols-1">
                        <select
                          id="type"
                          name="type"
                          defaultValue=""
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md border bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                        >
                          <option value="standard">Standard</option>
                          <option value="service">Service</option>
                          <option value="produit">Produit</option>
                        </select>
                        <BiChevronDown
                          aria-hidden="true"
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </div>
                    </div>
                    <div className="mt-5gap-2 sm:mt-6">
                      <Button
                        className="flex w-full items-center justify-center"
                        type="submit"
                      >
                        {trad?.newBtn}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
