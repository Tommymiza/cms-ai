import useRefreshPage from "@/hooks/use-refresh-page";
import { cn } from "@/lib/cn";
import { usePageStore } from "@/stores/page";
import { PageItem, PageType } from "@/stores/page/type";
import { useSiteStore } from "@/stores/site";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NodeApi, Tree } from "react-arborist";
import { BiFolder, BiMinusCircle, BiPlusCircle, BiWorld } from "react-icons/bi";
import { toast } from "sonner";
export type TreeNode = {
  id: number;
  children: TreeNode[];
  title: string;
  path: string;
  documentId: string;
  type: PageType;
  parent: number | null;
};

export default function TreeviewDnd({
  setContextMenu,
}: {
  setContextMenu: (contextMenu: {
    x: number;
    y: number;
    node: NodeApi<TreeNode>;
  }) => void;
}) {
  const { refreshPage } = useRefreshPage();
  const { updatePage } = usePageStore();
  const { site } = useSiteStore();
  async function updatePaths(
    node: TreeNode,
    newPath: string,
    order: number,
    parent_id: number | null
  ) {
    let n = !parent_id
      ? `/${newPath.split("/")[newPath.split("/").length - 1]}`
      : newPath;
    if (node.children && node.children.length > 0) {
      const promises = node.children.map(async (child, i) => {
        const childSegment = child.path.split("/").pop();
        const updatedChildPath = `${n}/${childSegment}`;
        await updatePage(child.documentId, {
          path: updatedChildPath,
          parent: node.id as unknown as PageItem,
          order: i,
        });
        await updatePaths(child, updatedChildPath, i, node.id);
      });
      await Promise.all(promises);
    }
    await updatePage(node.documentId, {
      path: n,
      parent: parent_id as unknown as PageItem,
      order: order,
    });
    return node;
  }

  const searchChildren = (id: number): TreeNode[] => {
    const children = site?.pages.filter(
      (d) => (d.parent as PageItem)?.id === id
    );
    if (children && children.length > 0) {
      return children
        .sort((a, b) => a.order - b.order)
        .map((child) => ({
          id: child.id,
          parent: (child.parent as PageItem)?.id ?? null,
          children: searchChildren(child.id),
          title: child.title,
          path: child.path,
          type: child.type,
          documentId: child.documentId,
        }));
    }
    return [];
  };

  useEffect(() => {
    if (!site) return;
    const pages: TreeNode[] = site.pages
      .sort((a, b) => a.order - b.order)
      .filter((child) => !child.parent)
      .map((page) => ({
        id: page.id,
        parent: (page.parent as PageItem)?.id ?? null,
        title: page.title ?? "",
        children: searchChildren(page.id),
        path: page.path,
        type: page.type,
        documentId: page.documentId,
      }));
    setTreeData(pages);
  }, [site]);

  const [treeData, setTreeData] = useState([] as TreeNode[]);

  const removeNode = (nodes: TreeNode[], id: string): TreeNode | undefined => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id.toString() === id) {
        return nodes.splice(i, 1)[0];
      } else if (nodes[i].children) {
        const result = removeNode(nodes[i].children, id);
        if (result) return result;
      }
    }
  };

  const insertNode = (
    nodes: TreeNode[],
    parentId: string | null,
    nodeToInsert: TreeNode,
    index: number
  ): boolean => {
    if (parentId === null) {
      nodes.splice(index, 0, nodeToInsert);
      return true;
    }
    for (const node of nodes) {
      if (node.id.toString() === parentId) {
        node.children = node.children || [];
        node.children.splice(index, 0, nodeToInsert);
        return true;
      } else if (node.children) {
        const inserted = insertNode(
          node.children,
          parentId,
          nodeToInsert,
          index
        );
        if (inserted) return true;
      }
    }
    return false;
  };

  const containsNode = (node: TreeNode, targetId: string): boolean => {
    if (node.id.toString() === targetId) return true;
    if (!node.children) return false;
    return node.children.some((child) => containsNode(child, targetId));
  };

  const isDescendant = (
    nodes: TreeNode[],
    ancestorId: string,
    targetId: string
  ): boolean => {
    for (const node of nodes) {
      if (node.id.toString() === ancestorId) {
        return containsNode(node, targetId);
      } else if (node.children) {
        if (isDescendant(node.children, ancestorId, targetId)) {
          return true;
        }
      }
    }
    return false;
  };

  const moveNode = (args: {
    dragIds: string[];
    dragNodes: NodeApi<TreeNode>[];
    parentId: string | null;
    parentNode: NodeApi<TreeNode> | null;
    index: number;
  }) => {
    const { dragNodes, parentId, index } = args;
    if (dragNodes.length === 0) return;

    const newTree: TreeNode[] = JSON.parse(JSON.stringify(treeData));

    for (const dragNode of dragNodes) {
      if (
        parentId &&
        isDescendant(newTree, dragNode.data.id.toString(), parentId)
      ) {
        toast.error(
          "❌ Impossible de déplacer un nœud dans un de ses enfants."
        );
        return;
      }
    }

    const removedNodes: TreeNode[] = [];
    for (const dragNode of dragNodes) {
      const removed = removeNode(newTree, dragNode.data.id.toString());
      if (removed) {
        removedNodes.push(removed);
      }
    }

    removedNodes.forEach((node, i) => {
      insertNode(newTree, parentId, node, index + i);
    });
    setTreeData(newTree);
    try {
      const promises = newTree.map(async (node, o) =>
        updatePaths(node, node.path, o, null)
      );
      Promise.all(promises)
        .then(async (c) => {
          console.log(c);
          toast.success("✅ Hiérarchie mise à jour avec succès.");
          await refreshPage();
        })
        .catch((err) => {
          toast.error("❌ Impossible de mettre à jour la hiérarchie.");
          throw err;
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Tree
      idAccessor={(d) => d.id.toString()}
      data={treeData}
      onMove={moveNode}
      openByDefault={true}
      disableMultiSelection={false}
    >
      {({ node, dragHandle, style }) => (
        <Node
          node={node}
          style={style}
          dragHandle={dragHandle}
          handleContextMenu={(e, node) => {
            e.preventDefault();
            setContextMenu({ x: e.clientX, y: e.clientY - 60, node });
          }}
        />
      )}
    </Tree>
  );
}

function Node({
  node,
  style,
  dragHandle,
  handleContextMenu,
}: {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  dragHandle?: (el: HTMLDivElement | null) => void;
  handleContextMenu: (e: React.MouseEvent, node: NodeApi<TreeNode>) => void;
}) {
  const token = sessionStorage.getItem("token");
  const { page } = usePageStore();
  const isActual = useMemo(() => {
    if (!page) return false;
    return page.id === node.data.id;
  }, [page, node]);

  return (
    <div
      style={style}
      ref={dragHandle}
      onContextMenu={(e) => handleContextMenu(e, node)}
      className={cn(
        "relative flex items-center gap-2",
        isActual && "bg-gray-200",
        node.isSelected && "bg-blue-100"
      )}
    >
      {node.data.children.length > 0 ? (
        <button className="p-0 text-primary" onClick={() => node.toggle()}>
          {node.isOpen ? (
            <BiMinusCircle className="h-4 w-4" />
          ) : (
            <BiPlusCircle className="h-4 w-4" />
          )}
        </button>
      ) : (
        <div className="h-4 w-4"></div>
      )}
      {node.data.children.length > 0 ? (
        <BiFolder className="h-5 w-5" />
      ) : (
        <BiWorld />
      )}
      <Link href={`${node.data.path}?token=${token}`}>
        <span className="block max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {node.data.title}
        </span>
      </Link>
    </div>
  );
}
