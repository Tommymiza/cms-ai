"use client";
import useRefreshPage from "@/hooks/use-refresh-page";
import { parseStyleString } from "@/lib/style";
import { voidElements } from "@/schemas/block";
import { useBlockStore } from "@/stores/block";
import { BlockItem } from "@/stores/block/type";
import { Fragment } from "react";
import { toast } from "sonner";
import Image from "../ui/Image";
import Link from "../ui/Link";
import style from "../ui/style";
import { DynamicComponent, DynamicComponentItems } from "./dynamic-block";

export const componentsMap: Record<string, React.ElementType> = {
  Link,
  img: Image,
  style,
};

const RenderBlock = ({ block }: { block: BlockItem }) => {
  const { deleteBlock } = useBlockStore();
  if (!block.data.type) {
    // deleteBlock(block.documentId);
    return null;
  }
  let Tag: React.HTMLElementType | React.ElementType =
    componentsMap[block.data.type];
  if (DynamicComponentItems.includes(block.data.type)) {
    if (!block.data.props?.dataid) return null;
    return (
      <DynamicComponent
        nom={block.data.type}
        dataId={block.data.props.dataid}
      />
    );
  }

  if (!Tag) {
    return <HTMLBlock block={block} />;
  }
  return <Tag block={block} />;
};

function HTMLBlock({ block }: { block: BlockItem }) {
  let Tag = block.data.type as
    | keyof React.JSX.IntrinsicElements
    | "fragment"
    | "text";
  let props = block.data.props;
  const style = block.data.props?.style
    ? parseStyleString(block.data.props.style)
    : {};

  const { refreshPage } = useRefreshPage();
  const { updateBlock } = useBlockStore();
  const handleSaveRichText = async (formData: any) => {
    try {
      await updateBlock(block.documentId, {
        data: {
          ...block.data,
          content: formData,
        },
      });
      await refreshPage();
      toast.success("Contenu mis à jour");
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la mise à jour du contenu");
    }
  };
  if (Tag === "fragment") {
    return (
      <Fragment>
        {block.data.content}
        {block.children?.map((b, i) => (
          <RenderBlock block={b} key={i} />
        ))}
      </Fragment>
    );
  }
  if (Tag === "text") {
    if (block.data.props) {
      return (
        <span {...props} style={style}>
          {block.data.content}
          {block.children?.map((b, i) => (
            <RenderBlock block={b} key={i} />
          ))}
        </span>
      );
    }
    return (
      <>
        {block.data.content}
        {block.children?.map((b, i) => (
          <RenderBlock block={b} key={i} />
        ))}
      </>
    );
  }
  if (voidElements.includes(Tag)) {
    return <Tag {...(props as any)} style={style} />;
  }

  return (
    <Tag {...(props as any)} style={style}>
      {block.data.content}
      {block.children?.map((b, i) => (
        <RenderBlock block={b} key={i} />
      ))}
    </Tag>
  );
}

export default RenderBlock;
