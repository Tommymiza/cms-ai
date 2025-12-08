import { z } from 'zod'

/**
 * Schéma Zod pour `site.configuration`
 * - Les champs attendus sont explicitement typés et décrits.
 * - Couleurs : hex (#rrggbb ou #rgb).
 * - radius / spacing / typography sizes : valeurs CSS (ex: "0.375rem", "20px", "100%").
 * - shadow : valeur CSS de box-shadow (ex: "0 4px 6px -1px rgba(0,0,0,0.1)").
 */

const cssColor = z.string().describe('Couleur en hexadécimal (ex: #C63C3C)')

const cssLength = z.string().describe('Valeur CSS de longueur ou taille (ex: "0.375rem", "1rem", "20px", "100%").')

const boxShadow = z
  .string()
  .describe('Valeur CSS complète pour box-shadow (ex: "0 4px 6px -1px rgba(0,0,0,0.1)" ou "none").')

export const ConfigurationSchema = z
  .object({
    // radius : jeux de radius en valeurs CSS (possibilité d'utiliser des clefs utilitaires)
    radius: z
      .object({
        sm: cssLength.describe('Petit radius (ex: 0.25rem)'),
        md: cssLength.describe('Radius par défaut moyen (ex: 0.375rem)'),
        lg: cssLength.describe('Grand radius (ex: 0.5rem)'),
        full: cssLength.describe('Radius full pour boutons pill (ex: 9999px)'),
        default: cssLength.describe('Radius par défaut à utiliser si non précisé'),
      })
      .describe('Collection de radii en valeurs CSS (sm, md, lg, full, default)'),

    // shadow : jeux de box-shadows
    shadow: z
      .object({
        sm: boxShadow.describe('Box-shadow petit'),
        md: boxShadow.describe('Box-shadow medium'),
        lg: boxShadow.describe('Box-shadow large'),
        none: z.literal('none').describe('Valeur "none" pour pas d\'ombre'),
        default: boxShadow.describe('Box-shadow par défaut'),
      })
      .describe('Collection de box-shadow utilisables dynamiquement'),

    // spacing : paddings / gaps
    spacing: z
      .object({
        'section-x': cssLength.describe('Padding horizontal des sections'),
        'section-y': cssLength.describe('Padding vertical des sections'),
        'block-gap': cssLength.describe('Gap par défaut entre blocs/éléments'),
        'btn-x': cssLength.describe('Padding horizontal des boutons'),
        'btn-y': cssLength.describe('Padding vertical des boutons'),
      })
      .describe('Espacements / paddings utilisés globalement'),

    // colors : palette
    colors: z
      .object({
        primary: cssColor.describe('Couleur primaire'),
        'primary-contrast': cssColor.describe('Contraste pour texte sur primaire'),
        secondary: cssColor.describe('Couleur secondaire'),
        accent: cssColor.describe('Couleur accent'),
        'accent-contrast': cssColor.describe('Contraste pour texte sur accent'),
        success: cssColor.describe('Couleur succès'),
        warning: cssColor.describe('Couleur avertissement'),
        danger: cssColor.describe('Couleur danger / erreur'),
        surface: cssColor.describe('Couleur des surfaces / cartes'),
        background: cssColor.describe('Couleur de fond principale'),
        text: cssColor.describe('Couleur du texte par défaut'),
        muted: cssColor.describe('Couleur de texte secondaire / muted'),
        border: cssColor.describe('Couleur des bordures'),
        ring: cssColor.describe("Couleur d'accentuation / focus ring"),
      })
      .describe('Palette de couleurs (hex)'),

    // border : style / width
    border: z
      .object({
        width: cssLength.describe('Largeur de bordure (ex: 1px)'),
        style: z.enum(['solid', 'dashed', 'dotted', 'double', 'none']).describe('Style de bordure CSS'),
      })
      .describe('Propriétés de bordure'),

    // typography
    typography: z
      .object({
        'font-family': z.string().describe('Famille de polices CSS (ex: "Inter, sans-serif")'),
        'font-size': cssLength.describe('Taille de base du texte (ex: 1rem)'),
        'font-weight-heading': z.number().describe('Poids des headings (ex: 700)'),
      })
      .describe('Propriétés typographiques globales'),
  })
  .describe("Schéma de configuration dynamique utilisé par l'UI (site.configuration)")

export type ConfigurationItem = z.infer<typeof ConfigurationSchema>
