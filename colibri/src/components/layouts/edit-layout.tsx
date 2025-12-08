"use client";
import BotContainer from "@/components/bot/bot-container";
import { cn } from "@/lib/cn";
import { usePageStore } from "@/stores/page";
import { useSiteStore } from "@/stores/site";
import tokenStore from "@/stores/token";
import { useTranslationStore } from "@/stores/translation";
import { useUiStore } from "@/stores/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { BiChat, BiRefresh, BiX } from "react-icons/bi";
import { Button } from "../utils/Button";

export default function EditLayout() {
  const { isPreview } = useSiteStore();
  const { page } = usePageStore();
  if (!isPreview || !page) {
    return null;
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DialogChat />
    </Suspense>
  );
}

function DialogChat() {
  const { bot: open, setBot, editBox, setIsAudioPermit } = useUiStore();
  const { token, tenant } = useSiteStore();

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        // Ne pas oublier de stopper le stream après la permission accordée
        stream.getTracks().forEach((track) => track.stop());
        setIsAudioPermit(true);
      } catch (error) {
        setIsAudioPermit(false);
        console.error("Permission microphone refusée ou erreur :", error);
      }
    };
    requestMicrophonePermission();
  }, []);

  const handleRefresh = async () => {
    localStorage.removeItem("chatMessages");
    window.location.reload();
  };
  useEffect(() => {
    if (editBox) {
      setBot(true);
    }
  }, [editBox]);
  const pathname = usePathname();

  const { t } = useTranslationStore();
  const trad = t?.cookies;
  const { balance, getBalance } = tokenStore();

  useEffect(() => {
    if (token && tenant) getBalance(token, tenant);
  }, [token, tenant]);

  return (
    <>
      <div className="fixed bottom-10 right-10">
        <Button
          onClick={() => setBot(true)}
          className="border border-gray-300 bg-transparent"
        >
          <BiChat className="h-6 w-6 text-[var(--tweeksy)]" />
        </Button>
      </div>
      <div
        key={pathname}
        className={cn(
          "fixed bottom-4 right-4 z-50 rounded-xl border border-gray-100 bg-slate-50 shadow-md dark:border-slate-50 dark:bg-zinc-950",
          open ? "block" : "hidden"
        )}
      >
        <div className="flex cursor-pointer items-center justify-between p-4">
          <h2 className="font-bold text-gray-950">Chat AI</h2>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-gray-950">Credit: {balance} </h2>
            <BiRefresh
              className="h-6 w-6 dark:text-white text-gray-950"
              onClick={handleRefresh}
              onTouchEnd={handleRefresh}
            />
            <BiX
              className="h-6 w-6 dark:text-white text-gray-950"
              onClick={() => setBot(false)}
              onTouchEnd={() => setBot(false)}
            />
          </div>
        </div>
        <div className="px-8">{token && <BotContainer />}</div>
      </div>
      <CookieConsent
        location="bottom"
        buttonText="Tout accepter"
        declineButtonText="Tout refuser"
        enableDeclineButton
        cookieName="accept-consent"
        overlay
        style={{
          background: "#2B373B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        contentStyle={{ flex: 1 }}
        buttonStyle={{
          background: "#ffffff",
          color: "#2B373B",
          fontSize: "13px",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
        declineButtonStyle={{
          background: "#ffffff",
          color: "#2B373B",
          fontSize: "13px",
          borderRadius: "20px",
          fontWeight: "bold",
        }}
        expires={150}
      >
        <div className="flex flex-col">
          <h1 className="text-sm font-bold text-white">{trad?.lead || ""}</h1>
          <p>{trad?.explication || ""}</p>
          <Link href={`/manage-consent`} className="text-white underline">
            {trad?.title || ""}
          </Link>
        </div>
      </CookieConsent>
    </>
  );
}
