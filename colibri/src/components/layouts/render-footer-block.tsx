"use client";
import useRefreshPage from "@/hooks/use-refresh-page";
import { parseStyleString } from "@/lib/style";
import { BlockData, voidElements } from "@/schemas/block";
import { usePageStore } from "@/stores/page";
import { useSiteStore } from "@/stores/site";
import { Fragment } from "react";
import { toast } from "sonner";
import Image from "./Image";
import Link from "./Link";
import style from "./style";

const componentsMap: Record<string, React.ElementType> = {
  a: Link,
  img: Image,
  style,
};

const RenderFooterBlock = ({ block }: { block: BlockData }) => {
  if (!block) return null;
  let Tag: React.HTMLElementType | React.ElementType =
    componentsMap[block.type];

  if (!Tag) {
    return <HTMLBlock block={block} />;
  }
  return <Tag block={block} />;
};
function HTMLBlock({ block }: { block: BlockData }) {
  let Tag = block.type as
    | keyof React.JSX.IntrinsicElements
    | "fragment"
    | "text";

  const style = block.props?.style ? parseStyleString(block.props.style) : {};
  const { site, updateSite } = useSiteStore();
  const { page, updatePage } = usePageStore();
  const { refreshPage } = useRefreshPage();

  const handleSaveRichText = async (formData: any) => {
    try {
      if (!site) return;

      if (!page) return;

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
        {block.content}
        {block.children?.map((b, i) => (
          <RenderFooterBlock block={b} key={i} />
        ))}
      </Fragment>
    );
  }

  if (Tag === "text") {
    if (block.props) {
      return (
        <span {...block.props} style={style}>
          {block.content}
          {block.children?.map((b, i) => (
            <RenderFooterBlock block={b} key={i} />
          ))}
        </span>
      );
    }
    return (
      <>
        {block.content}
        {block.children?.map((b, i) => (
          <RenderFooterBlock block={b} key={i} />
        ))}
      </>
    );
  }

  if (voidElements.includes(Tag)) {
    return <Tag {...(block.props as any)} style={style} />;
  }

  return (
    <Tag {...(block.props as any)} style={style}>
      {block.content}
      {block.children?.map((b, i) => (
        <RenderFooterBlock block={b} key={i} />
      ))}
    </Tag>
  );
}

export default RenderFooterBlock;
