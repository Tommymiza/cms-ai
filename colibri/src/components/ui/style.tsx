import { BlockItem } from "@/stores/block/type";

export default function style({ block }: { block: BlockItem }) {
  return <style dangerouslySetInnerHTML={{ __html: block.data.content }} />;
}
