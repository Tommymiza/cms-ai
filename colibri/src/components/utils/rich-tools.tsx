import { ChainedCommands, Editor } from "@tiptap/react";
import React, { forwardRef } from "react";
import {
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiItalic,
  BiListOl,
  BiListUl,
  BiStrikethrough,
  BiUnderline,
} from "react-icons/bi";
import { FaParagraph } from "react-icons/fa6";
import { IoIosQuote } from "react-icons/io";
import { LuHeading1, LuHeading2, LuHeading3 } from "react-icons/lu";
import ToolBtn from "./rich-tool-btn";

type ToolProps = {
  editor: Editor | null;
  style: React.CSSProperties;
};

const tools = [
  {
    task: "bold",
    icon: <BiBold size={20} />,
    value: "Bold",
  },
  {
    task: "italic",
    icon: <BiItalic size={20} />,
    value: "Italique",
  },
  {
    task: "underline",
    icon: <BiUnderline size={20} />,
    value: "Souligné",
  },
  {
    task: "strike",
    icon: <BiStrikethrough size={20} />,
    value: "Barré",
  },
  {
    task: "quote",
    icon: <IoIosQuote size={20} />,
    value: "Citation",
  },
  {
    task: "left",
    icon: <BiAlignLeft size={20} />,
    value: "Aligné à gauche",
  },
  {
    task: "center",
    icon: <BiAlignMiddle size={20} />,
    value: "Centré",
  },
  {
    task: "right",
    icon: <BiAlignRight size={20} />,
    value: "Aligné à droite",
  },
  {
    task: "bulletList",
    icon: <BiListUl size={20} />,
    value: "Liste à puces",
  },
  {
    task: "orderedList",
    icon: <BiListOl size={20} />,
    value: "Liste numérotée",
  },
] as const;

const headingOptions = [
  {
    task: "p",
    icon: <FaParagraph />,
    value: "Paragraph",
  },
  {
    task: "h1",
    icon: <LuHeading1 />,
    value: "Heading 1",
  },
  {
    task: "h2",
    icon: <LuHeading2 />,
    value: "Heading 2",
  },
  {
    task: "h3",
    icon: <LuHeading3 />,
    value: "Heading 3",
  },
] as const;

type TaskTool = (typeof tools)[number]["task"];
type HeadingTool = (typeof headingOptions)[number]["task"];

const chainCommands = (
  editor: Editor | null,
  command: (chain: ChainedCommands) => ChainedCommands
) => {
  if (!editor) return;
  command(editor.chain().focus()).run();
};

const Tool = forwardRef<HTMLDivElement, ToolProps>(
  ({ editor, style }: ToolProps, ref) => {
    const onClick = (task: TaskTool) => {
      switch (task) {
        case "bold":
          chainCommands(editor, (chain) => chain.toggleBold());
          break;
        case "italic":
          chainCommands(editor, (chain) => chain.toggleItalic());
          break;
        case "underline":
          chainCommands(editor, (chain) => chain.toggleUnderline());
          break;
        case "strike":
          chainCommands(editor, (chain) => chain.toggleStrike());
          break;
        case "left":
          chainCommands(editor, (chain) => chain.setTextAlign("left"));
          break;
        case "center":
          chainCommands(editor, (chain) => chain.setTextAlign("center"));
          break;
        case "right":
          chainCommands(editor, (chain) => chain.setTextAlign("right"));
          break;
        case "bulletList":
          chainCommands(editor, (chain) => chain.toggleBulletList());
          break;
        case "orderedList":
          chainCommands(editor, (chain) => chain.toggleOrderedList());
          break;
        case "quote":
          chainCommands(editor, (chain) => chain.toggleBlockquote());
          break;
        default:
          break;
      }
    };

    const handleHeadingChange: React.ChangeEventHandler<HTMLSelectElement> = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { value } = e.target as { value: HeadingTool };

      switch (value) {
        case "p":
          chainCommands(editor, (chain) => chain.setParagraph());
          break;
        case "h1":
          chainCommands(editor, (chain) => chain.toggleHeading({ level: 1 }));
          break;
        case "h2":
          chainCommands(editor, (chain) => chain.toggleHeading({ level: 2 }));
          break;
        case "h3":
          chainCommands(editor, (chain) => chain.toggleHeading({ level: 3 }));
          break;
        default:
          chainCommands(editor, (chain) => chain.setParagraph());
          break;
      }
    };

    const getSelectedHeading = () => {
      let result: HeadingTool = "p";

      if (editor?.isActive("heading", { level: 1 })) {
        result = "h1";
      }
      if (editor?.isActive("heading", { level: 2 })) {
        result = "h2";
      }
      if (editor?.isActive("heading", { level: 3 })) {
        result = "h3";
      }

      return result;
    };
    const handleColorChange = (e: React.FormEvent<HTMLInputElement>) => {
      editor?.chain().focus().setColor(e.currentTarget.value).run();
    };

    return (
      <div
        ref={ref}
        className="flex rounded-md flex-row gap-2 border border-primary p-1 max-w-xl absolute -top-10 left-0 z-30 bg-white items-center"
        style={style}
      >
        <select
          value={getSelectedHeading()}
          className="p-2 text-sm text-text-color"
          onChange={handleHeadingChange}
        >
          {headingOptions.map(({ task, value }) => (
            <option className="text-sm text-text-color" value={task} key={task}>
              {value}
            </option>
          ))}
        </select>

        <input
          type="color"
          onInput={handleColorChange}
          value={editor?.getAttributes("textStyle").color}
          data-testid="setColor"
        />

        {tools.map(({ task, icon }) => (
          <div key={task}>
            <ToolBtn
              active={
                editor?.isActive(task) || editor?.isActive({ textAlign: task })
              }
              onClick={() => {
                onClick(task);
              }}
            >
              {icon}
            </ToolBtn>
          </div>
        ))}
      </div>
    );
  }
);

Tool.displayName = "Tools";

export default Tool;
