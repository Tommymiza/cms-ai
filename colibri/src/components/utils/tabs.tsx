import { cn } from "@/lib/cn";
import { useTranslationStore } from "@/stores/translation";
import { useMemo } from "react";
import { BiChevronDown } from "react-icons/bi";
import Historique from "../settings/Historique";
import Informations from "../settings/Informations";
import Media from "../settings/Media";
import Structure from "../settings/Structure";

export function useTabs() {
  const { t } = useTranslationStore();
  const trad = t?.setting;
  const tabs = useMemo(
    () => [
      { name: trad?.information?.title, page: <Informations /> },
      { name: trad?.structure?.title, page: <Structure /> },
      { name: trad?.media?.title, page: <Media /> },
      { name: trad?.history?.title, page: <Historique /> },
    ],
    [trad]
  );
  return tabs;
}

export default function Tabs({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: (current: string) => void;
}) {
  const tabs = useTabs();
  return (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          defaultValue={tabs.find((tab) => tab.name === current)?.name}
          onChange={(e) => setCurrent(e.target.value)}
          aria-label="Select a tab"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline focus:-outline-offset-2 focus:outline-primary"
        >
          {tabs.map((tab, index) => (
            <option key={index}>{tab.name}</option>
          ))}
        </select>
        <BiChevronDown
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav aria-label="Tabs" className="-mb-px flex space-x-2">
            {tabs.map((tab, index) => (
              <p
                key={index}
                aria-current={tab.name === current ? "page" : undefined}
                className={cn(
                  tab.name === current
                    ? "border-tweeksy text-[var(--tweeksy)]"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "cursor-pointer whitespace-nowrap border-b-2 px-1 py-2 text-sm font-medium"
                )}
                onClick={() => setCurrent(tab.name)}
              >
                {tab.name}
              </p>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
