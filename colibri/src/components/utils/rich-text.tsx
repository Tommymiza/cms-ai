"use client";

import EditIcon from "@/components/icons/EditIcon";
import { cn } from "@/lib/cn";
import { extensions } from "@/lib/rich-text-extension";
import "@/styles/rich-text.css";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Tools from "./rich-tools";

type EditorProps = {
  handleSave?: (formData: any) => Promise<unknown>;
  value?: object;
  invert?: boolean;
  showEdit?: boolean;
  className?: string;
  style?: React.CSSProperties;
  setFocusProper?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function RichTextContent({
  content,
  className,
  isEditable = true,
  onEdit,
  id,
}: {
  content: any;
  className?: string;
  isEditable?: boolean;
  onEdit?: (formData: any) => Promise<void>;
  id?: string;
}) {
  const handleSave = async (formData: any) => {
    try {
      console.log("Saving rich text content:", id, formData);
      if (typeof onEdit === "function") {
        await onEdit(formData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour du contenu");
    }
  };
  return (
    <RichText
      value={content}
      handleSave={handleSave}
      className={className}
      showEdit={isEditable}
    />
  );
}

function RichText({
  handleSave,
  value,
  showEdit,
  className,
  invert,
  style,
  setFocusProper,
}: EditorProps) {
  const [isFocus, setIsFocus] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const toolRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<JSONContent | null>(null);

  const editor = useEditor({
    content: content || "",
    extensions,
    immediatelyRender: false,
    editable: isEdit,
    onFocus: () => {
      setIsFocus(true);
      if (setFocusProper) setFocusProper(true);
    },
    onContentError(props) {
      console.error("Error:", props.error);
    },
    onBlur: async ({ event, editor: editorBlur }) => {
      if (
        toolRef.current &&
        !toolRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsEdit(false);
        setIsFocus(false);
        if (setFocusProper) setFocusProper(false);
        editorBlur.setEditable(false);
        await handleSubmit();
      }
    },
    onUpdate: ({ editor: initialEditor }) => {
      setContent(initialEditor.getJSON());
    },
  });

  useEffect(() => {
    if (!value) return;
    setContent(value);
    editor?.commands.setContent(value);
  }, [editor, value]);

  useEffect(() => {
    if (editor && isEdit) {
      editor.setEditable(true);
      editor.commands.focus("end");
    }
  }, [isEdit, editor]);

  const handleEditIcon = (e: any) => {
    e.stopPropagation();
    setIsEdit(true);
  };

  const handleSubmit = useCallback(async () => {
    try {
      if (!editor) return;
      if (typeof handleSave === "function") {
        const formData = editor.getJSON();
        await handleSave(formData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsEdit(false);
    }
  }, [editor, handleSave]);

  return (
    <div className={cn("rich-text-container relative")}>
      {isFocus ? (
        <Tools
          editor={editor}
          ref={toolRef}
          style={{
            top: -50,
            left: "50%",
            zIndex: 100,
            transform: "translateX(-50%)",
          }}
        />
      ) : null}

      <EditorContent editor={editor} className={cn("w-auto", className)} />

      {showEdit ? (
        <div
          role="button"
          tabIndex={0}
          className="rich-text-edit-icon absolute -right-2 top-0 z-[100] h-5 w-5 cursor-pointer text-[var(--tweeksy)]"
          onClick={handleEditIcon}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleEditIcon(e);
          }}
        >
          <EditIcon className="h-5 w-5" invert={invert} />
        </div>
      ) : null}
    </div>
  );
}
