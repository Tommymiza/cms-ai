export function generateUrlAlias(text: string): string {
  return text
    .toLowerCase() // Convertir en minuscules
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprimer les caractères spéciaux
    .trim() // Supprimer les espaces en début et fin
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets consécutifs
}
