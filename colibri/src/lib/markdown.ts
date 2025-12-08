export function removeMarkdownLinks(markdown: string): string {
  // Supprime les liens du type [texte](url)
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/#[0-9A-Fa-f]{3,8}\b/g, '')
}
