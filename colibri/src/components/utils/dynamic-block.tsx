"use client";
import { getText } from "@/hooks/use-rich-text";
import { cn } from "@/lib/cn";
import { voidElements } from "@/schemas/block";
import { useAvisStore } from "@/stores/avis";
import { AvisItem } from "@/stores/avis/type";
import { useEtudeStore } from "@/stores/etude";
import { usePartenaireStore } from "@/stores/partenaire";
import { useProduitStore } from "@/stores/produit";
import { ProduitItem } from "@/stores/produit/type";
import { useServiceStore } from "@/stores/service";
import { ServiceItem } from "@/stores/service/type";
import { useSiteStore } from "@/stores/site";
import { EtudeCasItem } from "@/stores/site/type";
import { isNumber, isString } from "@tiptap/react";
import { useMemo } from "react";
import { toast } from "sonner";
import Image from "../ui/Image";
import { componentsMap } from "./render-block";
import RichTextContent from "./rich-text";

export const DynamicComponent = ({
  nom,
  dataId,
}: {
  nom: string;
  dataId: number;
}) => {
  const { site } = useSiteStore();
  const data = useMemo(() => {
    if (!site) return null;
    switch (nom) {
      case "ServiceItem":
        return site.services.find((s) => s.id === dataId) as ServiceItem;
      case "ProductItem":
        return site.produits.find((p) => p.id === dataId) as ProduitItem;
      case "AvisClientItem":
        return site.avis_clients.find((a) => a.id === dataId) as AvisItem;
      case "EtudeCasItem":
        return site.etude_cas.find((e) => e.id === dataId) as EtudeCasItem;
      case "PartenaireItem":
        return site.partenaires.find((p) => p.id === dataId);
      default:
        return null;
    }
  }, [dataId, nom, site]);
  if (!data) return null;
  const component = useMemo(() => {
    if (!site) return undefined;
    const component = site.components.find((c) => c.nom === nom);
    return component;
  }, [nom, site]);
  if (!component) return null;
  return <RenderDynamicBlock block={component.block} data={data} nom={nom} />;
};

const RenderDynamicBlock = ({
  block,
  data,
  nom,
}: {
  block: any;
  data: any;
  nom: string;
}) => {
  if (!block) return null;
  const { updateService } = useServiceStore();
  const { updateAvis } = useAvisStore();
  const { updateProduit } = useProduitStore();
  const { updateEtude } = useEtudeStore();
  const { updatePartenaire } = usePartenaireStore();
  let Tag =
    block.type !== "Image"
      ? block.field
        ? "div"
        : componentsMap[block.type]
      : Image;

  if (!Tag) Tag = block.type;

  const classNames = cn(block.props?.className);

  const titre = data.nom ? getText(data.nom) : getText(data.description);
  const switchUpdate = async (content: any) => {
    switch (nom) {
      case "ServiceItem":
        await updateService({
          documentId: data.documentId,
          data: { [block.field]: content },
        });
        break;
      case "ProductItem":
        await updateProduit({
          documentId: data.documentId,
          data: { [block.field]: content },
        });
        break;
      case "AvisClientItem":
        await updateAvis({
          documentId: data.documentId,
          data: { [block.field]: content },
        });
        break;
      case "EtudeCasItem":
        await updateEtude({
          documentId: data.documentId,
          data: { [block.field]: content },
        });
        break;
      case "PartenaireItem":
        await updatePartenaire({
          documentId: data.documentId,
          data: { [block.field]: content },
        });
        break;
    }
  };

  const handleUpdateImage = async (src: string) => {
    try {
      await switchUpdate(src);
    } catch (error) {
      console.log(error);
    }
  };

  if (voidElements.includes(Tag as string)) {
    return <Tag className={classNames} {...(block.props as any)} />;
  }

  if (Tag === Image) {
    let imageBlock = {
      ...block,
      data: {
        props: {
          ...block.props,
          alt: titre,
          src: data[block.field],
        },
      },
    };
    return <Image block={imageBlock} onUpdate={handleUpdateImage} />;
  }
  const onEdit = async (formData: any) => {
    try {
      await switchUpdate(formData);
      toast.success("Contenu mis à jour pour le composant dynamique");
    } catch (error) {
      console.log(error);
      toast.error(
        "Erreur lors de la mise à jour du contenu du composant dynamique"
      );
    }
  };

  return (
    <Tag className={classNames} {...(block.props as any)}>
      {block.field ? (
        isNumber(data[block.field]) || isString(data[block.field]) ? (
          data[block.field]
        ) : (
          <RichTextContent
            content={data[block.field]}
            className={classNames}
            isEditable={true}
            onEdit={onEdit}
          />
        )
      ) : null}
      {block.children?.map((b: any, i: number) => (
        <RenderDynamicBlock block={b} key={i} data={data} nom={nom} />
      ))}
    </Tag>
  );
};

export const DynamicComponentItems = [
  "ServiceItem",
  "ProductItem",
  "AvisClientItem",
  "EtudeCasItem",
  "PartenaireItem",
];
