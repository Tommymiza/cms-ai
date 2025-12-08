export const parseTitle = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 1 },
          content: [{ type: "text", text: obj[key] }],
        },
      ],
    });
  }
};

export const parseTitle2 = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 2 },
          content: [{ type: "text", text: obj[key] }],
        },
      ],
    });
  }
};

export const createTitle = (s: string) => {
  try {
    const temp = JSON.parse(s);
    return s;
  } catch (error) {
    const temp = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 1 },
          content: [{ type: "text", text: s }],
        },
      ],
    });
    return temp;
  }
};

export const createTitle2 = (s: string) => {
  try {
    const temp = JSON.parse(s);
    return s;
  } catch (error) {
    const temp = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 2 },
          content: [{ type: "text", text: s }],
        },
      ],
    });
    return temp;
  }
};

export const createTitleWhite = (s: string) => {
  try {
    const temp = JSON.parse(s);
    return s;
  } catch (error) {
    const temp = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 1 },
          content: [
            {
              type: "text",
              marks: [{ type: "textStyle", attrs: { color: "#ffffff" } }],
              text: s,
            },
          ],
        },
      ],
    });
    return temp;
  }
};

export const createTitleWhite2 = (s: string) => {
  try {
    const temp = JSON.parse(s);
    return s;
  } catch (error) {
    const temp = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { textAlign: null, level: 2 },
          content: [
            {
              type: "text",
              marks: [{ type: "textStyle", attrs: { color: "#ffffff" } }],
              text: s,
            },
          ],
        },
      ],
    });
    return temp;
  }
};

export const parseParagraph = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ type: "text", text: obj[key] }],
        },
      ],
    });
  }
};
export const parseParagraphWhite = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              type: "text",
              text: obj[key],
              marks: [{ type: "textStyle", attrs: { color: "#ffffff" } }],
            },
          ],
        },
      ],
    });
  }
};

export const parseParagraphBold = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            { type: "text", text: obj[key], marks: [{ type: "bold" }] },
          ],
        },
      ],
    });
  }
};
export const parseParagraphBoldWhite = (obj: any, key: string) => {
  try {
    const temp = JSON.parse(obj[key]);
  } catch (error) {
    obj[key] = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [
            {
              type: "text",
              text: obj[key],
              marks: [
                { type: "bold" },
                { type: "textStyle", attrs: { color: "#ffffff" } },
              ],
            },
          ],
        },
      ],
    });
  }
};

export const createParagraph = (s: string) => {
  try {
    const temp = JSON.parse(s);
    return s;
  } catch (error) {
    const temp = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          attrs: { textAlign: null },
          content: [{ type: "text", text: s }],
        },
      ],
    });
    return temp;
  }
};

export const getValueParser = (value: any): string => {
  try {
    const parsedContent = typeof value === "string" ? JSON.parse(value) : value;

    return parsedContent?.content?.[0]?.content?.[0]?.text || "Autres";
  } catch (e) {
    return "Autres";
  }
};
export function generateUrlAlias(text: string): string {
  return text
    .toLowerCase() // Convertir en minuscules
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, "") // Supprimer les caractères spéciaux
    .trim() // Supprimer les espaces en début et fin
    .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
    .replace(/-+/g, "-"); // Supprimer les tirets consécutifs
}
