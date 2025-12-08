import { parseStyleString } from "@/lib/style";
import { BlockData } from "@/schemas/block";
import Lnk from "next/link";
import RenderFooterBlock from "./render-footer-block";

export default function Link({ block }: { block: BlockData }) {
  const style = block.props?.style ? parseStyleString(block.props.style) : {};
  return (
    <Lnk {...(block.props as any)} style={style}>
      {block.content}
      {block.children?.map((b, i) => (
        <RenderFooterBlock block={b} key={i} />
      ))}
    </Lnk>
  );
}
