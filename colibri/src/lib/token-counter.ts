import { encode as encodeCl100kBase } from "gpt-tokenizer/encoding/cl100k_base";

export const collectTextDFS = (obj: any) => {
  let result: string[] = [];

  function dfs(node: any) {
    if (node == null) return;

    if (Array.isArray(node)) {
      for (const item of node) dfs(item);
    } else if (typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        if (key === "text" || key === "input" || key === "type") {
          result.push(JSON.stringify(value));
        }
        dfs(value);
      }
    }
  }

  dfs(obj);
  return result.join(" ");
};

export const tokenCounter = (
  text: string,
  model: string = "o200k_base"
): number => {
  let enc;
  enc = encodeCl100kBase(text);
  return enc.length;
};

export const tokenCounterChat = (
  chat: any,
  model: string = "o200k_base"
): number => {
  let enc;
  const text = collectTextDFS(chat);
  enc = encodeCl100kBase(text);
  return enc.length;
};
