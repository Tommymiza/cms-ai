export type TranslationStoreType = {
  t: any | null
  getTranslation: (lang: string) => Promise<any>
}
