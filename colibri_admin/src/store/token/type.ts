export type modelType = "openai/gpt5" | "recraft/image" | "openai/gpt4o" | "openai/gpt4o-mini" | "openai/gpt4o-mini"
export type typeToken = "input_token" | "output_token" | "refund" | "image_generation"
export type TokenHistory = {
  id: string
  model: modelType
  type: typeToken
  token_amount?: number
  tweeksy_amount?: number
  user_balance?: number
  tenant: number  
}

export type TokenStore = {
  balance: number
  loading: boolean
  getBalance: () => Promise<void>
  addToken: (token: number, model: modelType, type: typeToken) => Promise<void>
}


