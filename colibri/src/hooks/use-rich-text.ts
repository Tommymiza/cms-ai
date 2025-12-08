import { extensions } from "@/lib/rich-text-extension";
import { useEditor } from "@tiptap/react";

export function getText(content: any) {
  // get Text by tiptap
  const editor = useEditor({
    content: content || "",
    extensions,
    immediatelyRender: true,
  });

  return editor?.getText() || "";
}
