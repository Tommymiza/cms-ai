import { BlockData } from "@/schemas/block";
import { AvisItem } from "@/stores/avis/type";
import { BureauItem } from "@/stores/bureau/type";
import { PartenaireItem } from "@/stores/partenaire/type";
import { ProduitCategoryItem } from "@/stores/produit-category/type";
import { ProduitItem } from "@/stores/produit/type";
import { ServiceItem } from "@/stores/service/type";
import { ComponentItem } from "../component/type";
import { PageItem } from "../page/type";

export type Template = {
  id: number;
  name: string;
};

export type Widget = {
  name: string;
  schema: object;
  label?: string;
};

export type SiteClassification = {
  id: number;
  name: string;
};
export type Culture = {
  id: number;
  name: string;
  code: string;
  short_name: string;
  guuid: string;
  alias: string;
  last_modified: string | Date;
  is_ui_culture: boolean;
};

export type PropertyItem = {
  type: "string" | "number" | "boolean";
  name: string;
  describe: string;
  default_value?: string | number | boolean;
};

export type SocialMedia = {
  type:
    | "facebook"
    | "twitter"
    | "linkedin"
    | "instagram"
    | "youtube"
    | "pinterest";
  url: string;
};

export type Site = {
  id: number;
  documentId: string;
  display_name: string;
  description: string;
  components: ComponentItem[];
  default_visitor_culture: Culture;
  guid: string;
  main_domain_name: string;
  logo: string | null;
  slogan?: string;
  tweeksy_preview_domain_name: string;
  tweeksy_domain_name: string;
  tenant: number;
  fiche_entreprise?: {
    contact_email: string;
    coordonnees: string;
    phone: string;
  };
  header: BlockData;
  footer: BlockData;
  style: string;
  pages: PageItem[];
  produit_categories: ProduitCategoryItem[];
  social_media: SocialMedia[];
  services: ServiceItem[];
  bureaux: BureauItem[];
  avis_clients: AvisItem[];
  produits: ProduitItem[];
  partenaires: PartenaireItem[];
  etude_cas: EtudeCasItem[];
};

export type EtudeCasItem = {
  id: number;
  nom: string;
  resume: string;
  description: string;
  website: number;
  documentId: string;
};
// export type SocialMedia = {
//   type : 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'pinterest'
//   url: string
// }

export type PropertyName = {
  id?: number;
  documentId?: string;
  name?: string;
  createdAt?: string | Date;
  publishedAt?: string | Date;
  updatedAt?: string | Date;
};

export type Property = {
  id: number;
  documentId: string;
  value: string;
  createdAt: string | Date;
  publishedAt: string | Date;
  updatedAt: string | Date;
  local: string | null;
  properties_section_id: any;
  property_name?: PropertyName;
};

export type HomePageData = {
  id: number;
  documentId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: null;
  sections: SectionType[];
};
export type DataPage = {
  homePage: HomePageData;
  websiteInfo: WebsiteInfo;
};
export type Testimonial = {
  type: "testimonial";
  author: string;
  content: string;
  authorImg: string;
};
export type TestimonialSectionType = {
  type: "testimonials";
  widgets: Testimonial[];
};
export type SectionType =
  | {
      type: "hero" | "partnerList" | "caseStudy" | "service";
      widgets: WidgetType[];
    }
  | TestimonialSectionType;

type PartnerWidget = {
  type: "partnerItems";
  title: string;
  items: PartnerListItem[];
};
type CaseStudyWidget = {
  type: "caseStudyItems";
  items: CaseStudyCard[];
};
type ServiceListItem = {
  name: string;
  description: string;
};
type ServiceListWidget = {
  type: "serviceList";
  items: ServiceListItem[];
};
export type WidgetType =
  | {
      type: "heading1" | "heading2" | "text" | "subHeading";
      content: string;
    }
  | PartnerWidget
  | CaseStudyWidget
  | ServiceListWidget;

export type PartnerListItem = {
  image: string;
  label: string;
};
export type CaseStudyCard = {
  title: string;
  subtitle: string;
  year: string;
  client: {
    name: string;
    icon: string;
  };
  url: string;
};

export interface WebsiteInfo {
  fiche_entreprise: string;
  equipes: Equipe[];
  actualites: Actualite[];
  partenaires: EtudeCA[];
  avis_clients: AvisClient[];
  etude_cas: EtudeCA[];
  services: EtudeCA[];
  produits: EtudeCA[];
  website: number;
}

export interface Actualite {
  titre: string;
  description: string;
}

export interface AvisClient {
  nom: string;
  avis: string;
}

export interface AtedBy {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  registrationToken: null;
  isActive: boolean;
  blocked: boolean;
  preferedLanguage: null;
  createdAt: Date;
  updatedAt: Date;
  documentId: string;
  locale: null;
  publishedAt: null;
}

export interface Equipe {
  nom: string;
  poste: string;
}

export interface EtudeCA {
  nom: string;
  description: string;
}

export type State = {
  site: Site | null;
  token: string | null;
  loading: boolean;
  isPreview: boolean;
  tenant: number | null;
};

export type Action = {
  getSiteByUrl: (params: Record<string, any>) => Promise<Site | any>;
  setToken: (token: string | null) => void;
  updateSite: (documentId: string, site: Partial<Site>) => Promise<void>;
  setTenant: (tenant: number | null) => void;
  saveSite: ({
    site,
    pageId,
  }: {
    site: Partial<Site>;
    pageId: number;
  }) => Promise<void>;
  returnSite: (data: {
    documentId: string;
    pageDocumentId: string;
  }) => Promise<void>;
};
