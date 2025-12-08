import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const openRouterObject = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})("openai/gpt-oss-120b");

export const gpt5mini = openai("gpt-4o");

export const deepseekModelChat = deepseek("deepseek-chat");

export const deepseekModelRes = deepseek("deepseek-reasoner");

export const polaris = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})("openai/gpt-4.1-mini");
