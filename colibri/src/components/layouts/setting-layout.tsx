"use client";

import { useTranslationStore } from "@/stores/translation";
import { useEffect, useState } from "react";
import { BiCog } from "react-icons/bi";
import { Button } from "../utils/Button";
import Tabs, { useTabs } from "../utils/tabs";

export default function SettingLayout() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("Informations générales");
  const { t } = useTranslationStore();
  const trad = t?.setting;
  const tabs = useTabs();

  useEffect(() => {
    if (trad) {
      setCurrent(trad?.information?.title);
    }
  }, [trad]);
  return (
    <div className="fixed right-10 top-20 z-[100] text-gray-950">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setOpen((prev) => !prev)}
          className="border border-gray-300 bg-transparent"
        >
          <BiCog className="h-6 w-6 text-[var(--tweeksy)]" />
        </Button>
      </div>
      <div
        className="relative z-50"
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
          className="fixed inset-0 overflow-hidden"
          style={{
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute h-full w-full"
              onClick={() => setOpen(false)}
            ></div>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto relative w-screen max-w-2xl">
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
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
                  <div className="px-4 sm:px-6">
                    <h2
                      className="text-base font-semibold text-gray-900"
                      id="slide-over-title"
                    >
                      {trad?.title}
                    </h2>
                  </div>
                  <div className="relative mt-4 flex-1 px-4 sm:px-6">
                    <Tabs current={current} setCurrent={setCurrent} />
                    <div className="mt-2">
                      {tabs.find((tab) => tab.name === current)?.page}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
