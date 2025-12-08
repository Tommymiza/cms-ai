import { Site } from "../site/type";

export type HistoryItem = {
  id: number;
  documentId: string;
  createdAt: string;
  website?: number;
  data: Site;
};

export type HistoryStore = {
  historys: HistoryItem[];
  loading: boolean;
  createHistory: (
    history: Omit<HistoryItem, "id" | "documentId" | "createdAt">
  ) => Promise<void>;
  deleteHistory: (documentId: string) => Promise<void>;
  updateHistory: ({
    documentId,
    data,
  }: {
    documentId: string;
    data: Partial<HistoryItem>;
  }) => Promise<void>;
  getHistorys: (qs: any) => Promise<HistoryItem[]>;
};
