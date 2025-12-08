"use client";
import DndStandard from "@/components/utils/dnd-standard";
import RenderBlock from "@/components/utils/render-block";
import useRefreshPage from "@/hooks/use-refresh-page";
import { parseStyleString } from "@/lib/style";
import { useBlockStore } from "@/stores/block";
import { BlockItem } from "@/stores/block/type";
import { usePageStore } from "@/stores/page";
import { type DropResult } from "@hello-pangea/dnd";
import { Fragment } from "react";
import { toast } from "sonner";
import BaseLayout from "../layouts/base-layout";

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties
): React.CSSProperties => ({
  userSelect: "none",
  background: isDragging ? "" : "",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean): React.CSSProperties => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: "100%",
  marginBottom: grid * 2,
  minHeight: "100vh",
});

export default function Standard() {
  const { page } = usePageStore();
  const { refreshPage } = useRefreshPage();
  const { updateBlock } = useBlockStore();

  if (!page) return null;
  const styleBlocks = page.blocks.filter((b) => b.data.type === "style");
  const contentBlocks = page.blocks.filter((b) => b.data.type !== "style");

  const reorder = <T,>(
    list: T[],
    startIndex: number,
    endIndex: number
  ): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const dragEnd = async (r: DropResult<string>) => {
    const { destination, source } = r;

    // Annuler si pas de destination
    if (!destination) return;

    // Si même position → rien à faire
    if (destination.index === source.index) return;

    const reordered =
      contentBlocks.length === 1
        ? reorder(
            contentBlocks[0].children ?? [],
            source.index,
            destination.index
          ).map((b, i) => ({
            ...b,
            order: i + 1,
          }))
        : reorder(page.blocks, source.index, destination.index).map((b, i) => ({
            ...b,
            order: i + 1,
          }));

    try {
      if (!page) return;

      const promises = reordered.map(async (block) =>
        updateBlock(block.documentId, { order: block.order })
      );
      await Promise.all(promises);

      await refreshPage();
      toast.success("Page mise à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la page.");
      console.log(error);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: page.style,
        }}
      />
      <BaseLayout>
        {styleBlocks.map((block, index) => (
          <RenderBlock block={block} key={index} />
        ))}
        {contentBlocks.length === 1 ? (
          <HTMLBlock block={contentBlocks[0]}>
            <DndStandard
              items={contentBlocks[0].children || []}
              dropDirection="vertical"
              droppableId="droppable-data"
              onDragEnd={dragEnd}
              getKey={(item) => item}
              renderItem={(block, items) => <RenderBlock block={block} />}
              getItemStyle={getItemStyle}
              getListStyle={getListStyle}
            />
          </HTMLBlock>
        ) : (
          <DndStandard
            items={page.blocks.filter((b) => b.data.type !== "style")}
            dropDirection="vertical"
            droppableId="droppable-data"
            onDragEnd={dragEnd}
            getKey={(item) => item}
            renderItem={(block, items) => <RenderBlock block={block} />}
            getItemStyle={getItemStyle}
            getListStyle={getListStyle}
          />
        )}
      </BaseLayout>
    </>
  );
}
function HTMLBlock({
  block,
  children,
}: {
  block: BlockItem;
  children: React.ReactNode;
}) {
  let Tag = block.data.type as keyof React.JSX.IntrinsicElements | "fragment";
  let props = block.data.props;
  const style = block.data.props?.style
    ? parseStyleString(block.data.props.style)
    : {};
  if (Tag === "fragment") {
    return (
      <Fragment>
        {block.data.content}
        {children}
      </Fragment>
    );
  }

  return (
    <Tag {...(props as any)} style={style}>
      {block.data.content}
      {children}
    </Tag>
  );
}
