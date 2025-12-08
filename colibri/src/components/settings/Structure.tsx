import useRefreshPage from "@/hooks/use-refresh-page";
import { usePageStore } from "@/stores/page";
import { useTranslationStore } from "@/stores/translation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../utils/Button";
import { Input } from "../utils/input";

export default function Structure() {
  const { page } = usePageStore();
  const [form, setForm] = useState({
    show_menu: page?.show_menu,
    order: page?.order,
  });
  const { refreshPage } = useRefreshPage();
  const { t } = useTranslationStore();
  const trad = t?.setting?.structure;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;
    const { show_menu, order } = form;
    try {
      await refreshPage();
      toast.success("Document mis à jour avec succès");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour du document");
    }
  };
  useEffect(() => {
    setForm({
      show_menu: page?.show_menu,
      order: page?.order,
    });
  }, [page]);
  return (
    <div>
      <form className="flex flex-col items-center p-4" onSubmit={handleSubmit}>
        <div className="mb-4 grid w-full max-w-sm grid-cols-2 items-start gap-2">
          <label
            htmlFor="show_menu"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.showMenu}
          </label>
          <input
            type="checkbox"
            id="show_menu"
            name="show_menu"
            checked={form?.show_menu}
            className="w-fit accent-primary"
            onChange={(e) => {
              setForm({ ...form, show_menu: e.target.checked });
            }}
          />
        </div>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="order"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.order}
          </label>
          <Input
            name="order"
            id="order"
            value={form?.order}
            type="number"
            onChange={(e) => {
              setForm({ ...form, order: Number(e.target.value) });
            }}
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
