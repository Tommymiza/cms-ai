import utilsTool from "@/functions/utils";
import { cn } from "@/lib/cn";
import { parseStyleString } from "@/lib/style";
import { useBlockStore } from "@/stores/block";
import { BlockItem } from "@/stores/block/type";
import { useState } from "react";

export default function Image({
  block,
  onUpdate,
}: {
  block: BlockItem;
  onUpdate?: (src: string) => Promise<void>;
}) {
  const { createImage } = utilsTool();
  const [src, setSrc] = useState(
    (block.data.props as { src: string }).src ?? "upload://image"
  );
  const style = block.data.props?.style
    ? parseStyleString(block.data.props.style)
    : {};
  const [loading, setLoading] = useState(false);
  const { updateBlock } = useBlockStore();
  const handleError = async (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    try {
      setLoading(true);
      const description = block.data.props?.alt || "image";
      console.log("Generating image for description:", block);
      const url = await createImage(description);
      setSrc(url);
      if (onUpdate) {
        await onUpdate(url);
        setLoading(false);
        return;
      }
      await updateBlock(block.documentId, {
        data: {
          ...block.data,
          props: {
            ...block.data.props,
            src: url,
          },
        },
      });
      setSrc(url);
      // simple page update;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return loading ? (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-100 rounded-md",
        block.data.props?.className
      )}
      style={{ aspectRatio: "1 / 1" }}
    >
      <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  ) : (
    <img
      {...(block.data.props as { src: string; alt: string })}
      src={src}
      style={style}
      onError={handleError}
      className={cn(block.data.props?.className)}
    />
  );
}
