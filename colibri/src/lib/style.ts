export const parseStyleString = (styleStr: string) => {
  if (typeof styleStr !== "string") return styleStr;
  return styleStr
    .split(";")
    .map((rule) => rule.trim())
    .filter(Boolean)
    .reduce((acc: any, rule) => {
      const index = rule.indexOf(":");
      if (index === -1) return acc;

      const key = rule.substring(0, index).trim();
      const value = rule.substring(index + 1).trim();

      const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = value;

      return acc;
    }, {});
};
