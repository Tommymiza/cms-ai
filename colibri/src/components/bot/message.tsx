import { cn } from "@/lib/cn";
import { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import Avatar from "../utils/avatar";

export function Message({
  message,
}: {
  message: UIMessage;
  setFiles: (files: FileList | undefined) => void;
  isLast: boolean;
}) {
  const allText = message.parts
    .map((part) => {
      if (part.type === "text") {
        return part.text;
      }
      return "";
    })
    .join("");

  return (
    Boolean(allText) && (
      <div
        className={cn(
          "flex max-w-[100%] items-start gap-2 text-wrap",
          message.role === "user"
            ? "flex-row-reverse self-end"
            : "flex-row self-start"
        )}
      >
        {message.role === "user" && <Avatar name="U" size={40} />}
        {message.role !== "user" && (
          <Avatar size={40} src="/images/Tweeksy-logo-HD.png" />
        )}

        <div
          className={cn(
            "relative max-w-[80%] overflow-hidden rounded-md p-3 text-sm",
            message.role === "user"
              ? "bg-slate-700 text-white"
              : "bg-[#fefefe] text-zinc-950 dark:bg-slate-300"
          )}
          style={{
            color: message.role === "user" ? "white !important" : "inherit",
          }}
        >
          <ReactMarkdown
            className={cn(message.role === "assistant" && "prose")}
          >
            {allText}
          </ReactMarkdown>
        </div>
      </div>
    )
  );
}
