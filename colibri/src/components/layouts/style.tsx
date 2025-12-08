import { BlockData } from "@/schemas/block";

export default function style({ block }: { block: BlockData }) {
  return <style dangerouslySetInnerHTML={{ __html: block.content }} />;
}
