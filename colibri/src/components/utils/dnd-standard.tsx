"use client";

import useRefreshPage from "@/hooks/use-refresh-page";
import { cn } from "@/lib/cn";
import { useBlockStore } from "@/stores/block";
import { BlockItem } from "@/stores/block/type";
import { useSiteStore } from "@/stores/site";
import { useUiStore } from "@/stores/ui";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DropResult,
} from "@hello-pangea/dnd";
import clsx from "clsx";
import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/delete-icon";
import DragIcon from "../icons/drag-icon";

interface DragAndDropContainerProps<T> {
  items: T[];
  draggableContainer?: React.ElementType;
  dropDirection?: "vertical" | "horizontal";
  onDragEnd: (result: DropResult) => void;
  getKey: (item: T) => string;
  renderItem: (item: T, items: T[]) => ReactNode;
  droppableId: string;
  getListStyle?: (isDraggingOver: boolean) => React.CSSProperties;
  getItemStyle?: (
    isDragging: boolean,
    style: React.CSSProperties,
    showOrder?: boolean
  ) => React.CSSProperties;
}
// }

export function reorder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): any[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function DndStandard<T>({
  items,
  onDragEnd,
  droppableId,
  dropDirection = "vertical",
  renderItem,
  getListStyle = () => ({}),
  draggableContainer = "div",
  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    ...draggableStyle,
  }),
}: DragAndDropContainerProps<any>) {
  const { isDragging, setDragging, setEditBox } = useUiStore();
  const [isDragged, setIsDragged] = useState(false);
  const { isPreview } = useSiteStore();
  const { refreshPage } = useRefreshPage();
  const { deleteBlock } = useBlockStore();

  useEffect(() => {
    setDragging(isDragged);
  }, [isDragged, setDragging]);

  const handleDragEnd = (result: DropResult) => {
    setIsDragged(false);
    onDragEnd?.(result);
  };
  const handleDragStart = () => {
    setIsDragged(true);
  };
  const handleEdit = async (args: BlockItem) => {
    try {
      setEditBox("Je veux éditer le bloc : " + args.documentId);
    } catch (error: any) {
      console.log(error);
      toast.error("Une erreur est survenue");
    }
  };
  const handleDelete = async (args: BlockItem) => {
    try {
      await deleteBlock(args.documentId);
      await refreshPage();
      toast.success("Le bloc a été supprimé");
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la modification du site web"
      );
    }
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <Droppable droppableId={droppableId} direction={dropDirection}>
        {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {/* <DraggableContainer as={draggableContainer}> */}
            {items?.map((item, index) => (
              <Draggable
                key={index}
                draggableId={index.toString()}
                index={index}
                isDragDisabled={!isPreview}
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    // {...draggableProvided.dragHandleProps}
                    // style={getItemStyle(
                    //   draggableSnapshot.isDragging,
                    //   draggableProvided.draggableProps.style || {}
                    // )}
                    className="group/item relative border-transparent border-2 hover:border-[var(--tweeksy)]"
                  >
                    {isPreview ? (
                      <div className="absolute left-0 top-0 z-10 hidden cursor-pointer flex-row items-center gap-2 text-[var(--tweeksy)] transition-all duration-300 group-hover/item:flex">
                        <span
                          {...draggableProvided.dragHandleProps}
                          className={cn(
                            isDragging && "block group-hover/item:block"
                          )}
                        >
                          <DragIcon width={20} height={20} />
                        </span>
                        <span
                          className={clsx(
                            {
                              "hidden group-hover/item:block": !isDragging,
                              block: isDragging,
                            },
                            "cursor-pointer text-[var(--tweeksy)]"
                          )}
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon />
                        </span>
                        <span
                          className={clsx(
                            {
                              "hidden group-hover/item:block": !isDragging,
                              block: isDragging,
                            },
                            "cursor-pointer text-[var(--tweeksy)]"
                          )}
                          onClick={() => handleDelete(item)}
                        >
                          <DeleteIcon />
                        </span>
                      </div>
                    ) : null}
                    {renderItem(item, items)}
                  </div>
                )}
              </Draggable>
            ))}
            {/* </DraggableContainer> */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
