import useToolHandler from "@/hooks/use-tool-handler";
import axios from "@/lib/axios";
import { cn } from "@/lib/cn";
import { en, fr } from "@/lib/constant";
import { removeMarkdownLinks } from "@/lib/markdown";
import { collectTextDFS, tokenCounter } from "@/lib/token-counter";
import { useSiteStore } from "@/stores/site";
import { Culture } from "@/stores/site/type";
import tokenStore from "@/stores/token";
import { useTranslationStore } from "@/stores/translation";
import { useUiStore } from "@/stores/ui";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  UIMessage,
} from "ai";
import { usePathname } from "next/navigation";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiPaperPlane } from "react-icons/bi";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { toast } from "sonner";
import LoadingChat from "./loading-chat";
import { Message } from "./message";
import Speech from "./speech";

export default function BotContainer() {
  const chatContainer = useRef<HTMLDivElement>(null);
  const { setUpload, editBox, setEditBox } = useUiStore();

  const { t } = useTranslationStore();
  const { addToken } = tokenStore();
  const trad = t?.bot;
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [fileLoading, setFileLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { site, token, tenant } = useSiteStore();
  const audio = useRef<HTMLAudioElement>(null);
  const submitButton = useRef<HTMLButtonElement>(null);
  const [loadVoice, setLoadVoice] = useState(false);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const pathname = usePathname();

  const [switcher, setSwitcher] = useState<boolean>(
    localStorage.getItem("switcher")
      ? localStorage.getItem("switcher") === "true"
      : true
  );

  const switcherRef = useRef(switcher);

  const [result, setResult] = useState<string | null>(null);
  const recognition: SpeechRecognition | undefined = useMemo(
    () =>
      Boolean(window.webkitSpeechRecognition || window.SpeechRecognition)
        ? new (window as any).webkitSpeechRecognition() ||
          new (window as any).SpeechRecognition()
        : undefined,
    []
  );

  const [input, setInput] = useState("");

  const [isListening, setIsListening] = useState(false);

  const scroll = () => {
    const container = chatContainer.current;
    if (container) {
      const { offsetHeight, scrollHeight, scrollTop } = container;
      if (scrollHeight >= scrollTop + offsetHeight) {
        container.scrollTo(0, scrollHeight + 200);
      }
    }
  };

  const { handleToolCall } = useToolHandler(setLoadingText, scroll);

  const playLastMessage = (lastMessage: UIMessage) => {
    const lastText = lastMessage.parts
      .map((part) => {
        if (part.type === "text") {
          return part.text;
        }
        return "";
      })
      .join("");
    if (Boolean(lastText)) {
      const filteredText = removeMarkdownLinks(lastText);
      console.log(filteredText);
      getAudioWithoutSignal(filteredText);
    }
  };

  const {
    messages,
    setMessages,
    error,
    sendMessage,
    status,
    addToolResult,
    clearError,
    regenerate,
  } = useChat({
    transport: new DefaultChatTransport({
      api: `/api/bot`,
      body: {
        token,
        pathname,
        tenant,
      },
    }),
    onError(erreur) {
      toast.error("Un problème est survenu !");
      console.error(erreur);
      clearError();
      // regenerate();
    },
    async onToolCall({ toolCall }) {
      console.log("Tool call", toolCall);
      await handleToolCall({ toolCall, addToolResult });
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: async ({ message, messages, isAbort, isDisconnect, isError }) => {
      if (isAbort || isDisconnect || isError) return;
      if (switcherRef.current) {
        playLastMessage(message);
      }
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      const rawText = collectTextDFS(message);
      const outputToken = tokenCounter(rawText);
      if (!tenant) {
        toast.error("Tenant non défini, impossible de facturer les tokens.");
        return;
      }
      await addToken(outputToken, "openai/gpt5", "output_token", tenant);
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, 2000);
      });
      scroll();
    },
  });

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
      return;
    }
    setMessages([
      {
        id: "DzJjC0gXT3YHbikI",
        role: "assistant",
        parts: [
          {
            type: "text",
            text:
              (site?.default_visitor_culture as Culture).code === "fr"
                ? fr.bot["initial-message"]
                : en.bot["initial-message"],
            state: "done",
          },
        ],
      },
    ]);
  }, []);

  const updateLoadingText = () => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "assistant") {
      return;
    }

    const lastPart: any = lastMessage.parts[lastMessage.parts.length - 1];

    if (!lastPart) {
      return;
    }

    let nextValue: string | null = null;

    if (lastPart.type.includes("tool")) {
      const state = lastPart.state;
      if (!state) return;
      switch (state) {
        case "input-streaming":
          nextValue = "Préparation des données...";
        case "input-available":
          nextValue = "Préparation des données...";
          break;
        case "output-available":
          nextValue = "Réception de la réponse de l'IA...";
          break;
        case "output-error":
          nextValue = null;
          break;
        default:
          nextValue = null;
          break;
      }
    }

    if (nextValue !== loadingText) {
      setLoadingText(nextValue);
    }
  };

  useEffect(() => {
    updateLoadingText();
  }, [messages]);

  const getAudioWithoutSignal = useCallback(
    async (content: string) => {
      try {
        setLoadVoice(true);
        const response = await fetch(
          `/api/${(site?.default_visitor_culture as Culture).code}/audio`,
          {
            method: "POST",
            body: JSON.stringify({
              content,
            }),
          }
        );
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
        const url = URL.createObjectURL(blob);
        if (audio.current) {
          audio.current.src = url;
          audio.current.play();
        }
      } catch (error) {
        console.log(error);
        return null;
      } finally {
        setLoadVoice(false);
      }
    },
    [site]
  );

  useEffect(() => {
    switcherRef.current = switcher;
  }, [switcher]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    scroll();
    if (messages.length > 0 && messages[messages.length - 1].role === "user") {
      setUpload(false);
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  }, [input]);

  useEffect(() => {
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      setFileLoading(true);
      axios
        .post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setInput("L'image:" + response.data[0].url);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => setFileLoading(false));
    } else {
      setInput("");
    }
  }, [files]);

  useEffect(() => {
    if (!isListening && result) {
      setInput(result);
      handleSubmitEvent();
    }
  }, [isListening, result]);

  useEffect(() => {
    // Vérifier si SpeechRecognition est supporté
    let controller = new AbortController();

    if (!recognition) {
      toast.error("SpeechRecognition API non supportée.");
      console.error("SpeechRecognition API non supportée.");
      return;
    }

    let isPressed = false;

    const startRecognition = () => {
      if (!isPressed) {
        isPressed = true;
        setIsListening(true);
        if (recognition) recognition.start();
      }
    };
    const stopRecognition = () => {
      if (isPressed) {
        isPressed = false;
        if (recognition) recognition.stop();
      }
    };

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang =
      (site?.default_visitor_culture as Culture).code === "fr"
        ? "fr-FR"
        : "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (event.results[event.results.length - 1].isFinal) {
        let finalTranscript = "";
        for (let result of event.results) {
          finalTranscript += result[0].transcript;
        }
        setInput(finalTranscript);
        setResult(finalTranscript);
        if (!isPressed) {
          setIsListening(false);
        }
        return;
      }
      let interimTranscript = "";
      for (let result of event.results) {
        interimTranscript += result[0].transcript;
      }
      setInput(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.log("error", event);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("end");
      setIsListening(false);
    };

    // Détecter l'appui et le maintien de la touche espace
    const handleKeyDown = (event: any) => {
      if (event.key === " " && event.ctrlKey && !isListening) {
        event.preventDefault();
        if (audio.current) {
          audio.current.pause();
        }
        startRecognition();
      }
    };

    // Détecter quand la touche est relâchée
    const handleKeyUp = (event: any) => {
      if (event.key === " ") {
        stopRecognition();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if (recognition) recognition.stop();
      controller.abort();
    };
  }, [site?.default_visitor_culture]);

  useEffect(() => {
    if (editBox) {
      sendMessage({
        text: editBox,
      });
      setEditBox(null);
    }
  }, [editBox, site?.default_visitor_culture]);

  const renderMessage = () => {
    return messages
      .filter((m) => m.role !== "system")
      .map((m) => (
        <Message
          message={m}
          key={m.id}
          setFiles={setFiles}
          isLast={
            messages.findIndex((me) => me.id === m.id) === messages.length - 1
          }
        />
      ));
  };

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitEvent();
  };

  const handleSubmitEvent = () => {
    try {
      if (status !== "ready") return;
      sendMessage({
        text: input.trim(),
      });
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Empêche l'ajout d'une nouvelle ligne
      console.log("Form submitted!");
      handleSubmitEvent();
    }
  };

  return (
    <div className="flex max-h-[500px] min-h-[500px] max-w-[340px] flex-col items-center justify-between gap-4 overflow-hidden max-sm:w-full">
      <div
        className={cn("flex w-full flex-col gap-2 overflow-auto")}
        ref={chatContainer}
      >
        {renderMessage()}
        {loadingText && (
          <div className="flex w-full flex-col items-center gap-2 text-black dark:text-white">
            <p>{loadingText}</p>
          </div>
        )}
        {(status !== "ready" || fileLoading || loadVoice) && <LoadingChat />}
      </div>
      <div className="flex w-full flex-col items-center">
        <hr className="my-2 w-full border-gray-300 dark:border-gray-700" />
        {recognition && (
          <div className="mt-2 flex flex-col">
            <audio controls ref={audio} className="hidden" />
            <Speech isListening={isListening} />
          </div>
        )}
        <form
          onSubmit={handleSend}
          ref={formRef}
          className="relative mt-2 w-full"
        >
          <textarea
            className="w-full rounded-[40px] border-2 bg-white p-4 pr-20 dark:bg-gray-800 text-gray-950 dark:[color-scheme:dark]"
            placeholder={trad?.["input-placeholder"] ?? ""}
            onChange={(e) => setInput(e.target.value)}
            ref={inputRef}
            value={input}
            disabled={fileLoading}
            rows={1}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-4 top-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSwitcher((prev) => !prev);
                localStorage.setItem("switcher", String(!switcher));
              }}
              disabled={loadVoice}
            >
              {switcher ? (
                <HiSpeakerWave className="h-6 w-6 text-zinc-950 dark:text-slate-50" />
              ) : (
                <HiSpeakerXMark className="h-6 w-6 text-zinc-950 dark:text-slate-50" />
              )}
            </button>
            <button type="submit" ref={submitButton}>
              <BiPaperPlane className="h-6 w-6 text-zinc-950 dark:text-slate-50" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
