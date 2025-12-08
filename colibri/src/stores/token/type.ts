export type modelType =
  | "openai/gpt5"
  | "recraft/image"
  | "openai/gpt4o"
  | "openai/gpt4o-mini"
  | "openai/gpt4o-mini";
export type typeToken =
  | "input_token"
  | "output_token"
  | "refund"
  | "image_generation";

export type TokenStore = {
  balance: number;
  loading: boolean;
  getBalance: (token: string, tenant: number) => Promise<void>;
  addToken: (
    token: number,
    model: modelType,
    type: typeToken,
    tenant: number
  ) => Promise<void>;
};
