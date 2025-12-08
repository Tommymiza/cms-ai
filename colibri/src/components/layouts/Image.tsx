import utilsTool from "@/functions/utils";
import { cn } from "@/lib/cn";
import { parseStyleString } from "@/lib/style";
import { BlockData } from "@/schemas/block";
import { usePageStore } from "@/stores/page";
import { useState } from "react";

export default function Image({
  block,
  onUpdate,
}: {
  block: BlockData;
  onUpdate?: (src: string) => Promise<void>;
}) {
  const { createImage } = utilsTool();
  const [src, setSrc] = useState(
    (block.props as { src: string }).src ?? "upload://image"
  );
  const [loading, setLoading] = useState(false);

  const style = block.props?.style ? parseStyleString(block.props.style) : {};

  const { page, updatePage } = usePageStore();
  const handleError = async (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    try {
      setLoading(true);
      const description = block.props?.alt || "image";
      // console.log("Generating image for description:", description);
      // const url = await createImage(description);
      // setSrc(url);
      // if (onUpdate) {
      //   await onUpdate(url);
      //   setLoading(false);
      //   return;
      // }
      // // simple page update;
      // if (!page) return;
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
        block.props?.className
      )}
      style={{ aspectRatio: "1 / 1" }}
    >
      <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  ) : (
    <img
      {...(block.props as { src: string; alt: string })}
      onError={handleError}
      style={style}
    />
  );
}
