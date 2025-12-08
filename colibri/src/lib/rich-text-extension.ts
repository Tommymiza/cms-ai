import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import BaseHeading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import {
  BulletList,
  ListItem,
  ListKeymap,
  OrderedList,
  TaskItem,
  TaskList,
} from "@tiptap/extension-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { mergeAttributes } from "@tiptap/react";

const TextAlignExtension = TextAlign.configure({
  types: ["heading", "paragraph"],
});

type Levels = 1 | 2 | 3;

const classes: Record<Levels, string> = {
  1: "font-size: 3rem; line-height: 4.5rem",
  2: "font-size: 1.5rem;",
  3: "font-size: 1rem;",
};

const Heading = BaseHeading.configure({ levels: [1, 2, 3] }).extend({
  renderHTML({ node, HTMLAttributes }) {
    const hasLevel = this.options.levels.includes(node.attrs.level);
    const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0];

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        class: `font-display`,
        style: classes[level],
      }),
      0,
    ];
  },
});

const BlockquoteExtension = Blockquote.configure({
  HTMLAttributes: {
    class: "blockquote-editor",
  },
});

const ColorExtension = Color.configure({
  types: ["textStyle"],
});

const TextStyleExtension = TextStyle.configure({ mergeNestedSpanStyles: true });

export const extensions = [
  Document,
  Strike,
  Bold,
  Paragraph,
  Italic,
  Heading,
  BlockquoteExtension,
  Text,
  Underline,
  TextAlignExtension,
  TextStyleExtension,
  ColorExtension,
  Link,
  ListKeymap,
  ListItem,
  OrderedList,
  BulletList,
  TaskItem,
  TaskList,
  HorizontalRule,
  HardBreak,
];
