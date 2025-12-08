import { cn } from "@/lib/cn";
import { parseStyleString } from "@/lib/style";
import { BlockItem } from "@/stores/block/type";
import Lnk from "next/link";
import RenderBlock from "../utils/render-block";
import RichTextContent from "../utils/rich-text";

export default function Link({ block }: { block: BlockItem }) {
  const token = sessionStorage.getItem("token") ?? "";
  if (!block) return null;
  const linkProps = block.data.props?.href ?? "";
  const href = !linkProps.includes(":")
    ? linkProps + `?token=${token}`
    : linkProps;
  const classNames = cn(block.data.props?.className);
  const style = block.data.props?.style
    ? parseStyleString(block.data.props.style)
    : {};
  let children: BlockItem[] = [];
  if (block.children && block.children.length > 0) {
    children = block.children.map((b) => {
      if (b.data.props) {
        return {
          ...b,
          data: {
            ...b.data,
            props: {
              ...b.data.props,
              className: b.data.props.className + " " + classNames,
            },
          },
        };
      }
      return { ...b, data: { ...b.data, props: { className: classNames } } };
    });
  }
  return (
    <Lnk
      href={href}
      className={cn(
        !block.children ||
          (block.children.some((b) => !b.data.content) && classNames)
      )}
      style={style}
    >
      {block.data.content && (
        <RichTextContent
          isEditable={false}
          content={block.data.content}
          className={classNames}
        />
      )}
      {children.map((b, i) => (
        <RenderBlock block={b} key={i} />
      ))}
    </Lnk>
  );
}
