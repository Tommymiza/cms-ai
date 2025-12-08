import useRefreshPage from "@/hooks/use-refresh-page";
import axios from "@/lib/axios";
import { useTranslationStore } from "@/stores/translation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../utils/Button";
import { Input } from "../utils/input";

export default function Media() {
  const [form, setForm] = useState({
    summary: "",
  });
  const { refreshPage } = useRefreshPage();
  const { t } = useTranslationStore();
  const trad = t?.setting?.media;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formCurrent = e.target as HTMLFormElement;
    const files = formCurrent.files.files as FileList;
    let updatedDoc = {};
    if (files.length !== 0) {
      const res = await axios.post(
        "/upload",
        new FormData(e.target as HTMLFormElement)
      );
      const data = res.data;
      const img = data[0].url;
      const { summary } = form;
    } else {
      const { summary } = form;
      updatedDoc = {
        summary: summary ?? "",
      };
    }

    try {
      await refreshPage();
      toast.success("Document mis à jour avec succès");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour du document");
    }
  };

  return (
    <div>
      <form className="flex flex-col items-center p-4" onSubmit={handleSubmit}>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.image}
          </label>
          <input
            type="file"
            className="block w-full pt-4 text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
            name="files"
            id="files"
          />
        </div>
        <div className="mb-4 w-full max-w-sm grid-cols-2 items-center gap-2">
          <label
            htmlFor="page_keywords"
            className="block text-sm font-medium text-gray-700"
          >
            {trad?.summary}
          </label>
          <Input
            name="summary"
            id="summary"
            value={form?.summary ?? ""}
            onChange={(e) => {
              setForm({ ...form, summary: e.target.value });
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
