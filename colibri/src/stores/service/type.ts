export type ServiceItem = {
  id: number;
  title: any;
  documentId: string;
  description: any;
  image: string;
  website?: number;
  updatedAt: string;
};

export type ServiceStore = {
  services: ServiceItem[];
  loading: boolean;
  createService: (service: ServiceItem) => Promise<void>;
  deleteService: (documentId: string) => Promise<void>;
  searchService: (search: string, websiteId?: number) => Promise<any[]>;
  updateService: ({
    documentId,
    data,
  }: {
    documentId: string;
    data: Partial<ServiceItem>;
  }) => Promise<any>;
  getServices: () => Promise<void>;
};
