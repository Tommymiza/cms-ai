import axios from '@/lib/axios'
import { polaris } from '@/lib/model'
import { tokenCounter } from '@/lib/token-counter'
import { SiteDataSchema } from '@/types/site-data'
import { generateObject, zodSchema } from 'ai'
import { NextResponse } from 'next/server'
import z from 'zod'

export const maxDuration = 300

const schema = z.object({
  siteData: SiteDataSchema.describe('Les données du site'),
})

export async function POST(request: Request) {
  try {
    const { site, token, tenantId } = await request.json()
    const systemMessage = `
        <context_gathering>
            Site data: ${JSON.stringify(site)}
        </context_gathering>
      `

    const taskPrompt = `
Tu es un assistant IA spécialisé dans la génération de contenus structurés pour des sites web.

Ton rôle est de créer des LISTES de données dynamiques et flexibles selon les besoins du site.

## Architecture des listes

Chaque liste que tu crées doit contenir :
1. **list_key** : Un identifiant unique et descriptif (ex: "home_testimonials", "about_team_members")
2. **item_category** : Une catégorie fonctionnelle que TU DÉFINIS librement (ex: "testimonial", "faq", "team_member", "feature", "project", etc.)
3. **schema** : La structure des données avec :
   - fields : tableau de champs avec { key, type, required, label, description }
   - version : numéro de version (commence à 1)
   - description : description du schéma
4. **items** : Le tableau des données respectant le schéma défini
5. **breaking** : false par défaut (true seulement si tu modifies un schéma existant de façon cassante)
6. **user_notice** : message optionnel pour expliquer les changements

## Structure des items

**IMPORTANT** : Chaque item doit OBLIGATOIREMENT contenir un champ "id" unique.

Format de l'ID : "item_" suivi d'un timestamp ou d'un identifiant unique (ex: "item_1733404800123")

Exemple d'item :
\`\`\`json
{
  "id": "item_1733404800123",
  "name": "John Doe",
  "quote": "Excellent service !"
}
\`\`\`

Les IDs doivent être uniques pour TOUS les items de TOUTES les listes du site.

## Types de champs disponibles

Tu peux utiliser ces types : 'string', 'number', 'boolean', 'date', 'url', 'email', 'text', 'array', 'object'

Note : Le champ "id" est automatiquement ajouté à tous les items, tu n'as pas besoin de le définir dans le schema.fields.

## Règles importantes

1. **IDs uniques** : Génère un ID unique pour chaque item (ne jamais réutiliser le même ID)
2. **Automatisme des listes** : Si tu dois créer plus d'un élément homogène, crée automatiquement une LISTE
3. **Réutilisation** : Vérifie toujours si une liste similaire existe déjà avant d'en créer une nouvelle
4. **Catégories libres** : Tu peux inventer n'importe quelle catégorie pertinente pour le contexte
5. **Schémas flexibles** : Adapte la structure des champs selon les besoins réels du contenu
6. **Cohérence** : Garde une structure cohérente pour des contenus similaires sur le même site

## Exemples de listes à créer automatiquement

- Témoignages clients → category: "testimonial"
- Membres de l'équipe → category: "team_member"
- FAQ → category: "faq"
- Projets/Portfolio → category: "project"
- Fonctionnalités → category: "feature"
- Étapes d'un processus → category: "process_step"
- Partenaires → category: "partner"
- Services → category: "service"
- Etc.

Génère maintenant les listes de données appropriées pour ce site.

Voici le schéma de réponse à suivre:
${JSON.stringify(zodSchema(schema, { useReferences: true }))}
      `
    const promptToken = tokenCounter(systemMessage, 'gpt-5')
    const tokenCount = tokenCounter(taskPrompt, 'gpt-5')
    const totalInputToken = promptToken + tokenCount
    console.log('Total input token', totalInputToken)
    try {
      const response = await axios.post(
        '/token-histories',
        {
          data: {
            token_amount: totalInputToken,
            model: 'openai/gpt5',
            type: 'input_token',
            tenant: tenantId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (e) {
      return NextResponse.json(
        {
          message: 'Not enough balance' + JSON.stringify(e),
        },
        {
          status: 403,
        }
      )
    }
    const result = await generateObject({
      model: polaris,
      system: systemMessage,
      prompt: taskPrompt,
      schema: zodSchema(schema, { useReferences: true }),
    })

    const totalOutputToken = tokenCounter(JSON.stringify(result), 'gpt-5')
    console.log('Total output token', totalOutputToken)

    try {
      const response = await axios.post(
        '/token-histories',
        {
          data: {
            token_amount: totalOutputToken,
            model: 'openai/gpt5',
            type: 'output_token',
            tenant: tenantId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (e) {
      console.log(e)
      return NextResponse.json(
        {
          message: 'Not enough balance:' + JSON.stringify(e),
        },
        {
          status: 403,
        }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
