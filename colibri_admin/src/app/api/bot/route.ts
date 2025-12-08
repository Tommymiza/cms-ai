import axios from '@/lib/axios'
import { polaris } from '@/lib/model'
import { tokenCounter } from '@/lib/token-counter'
import { SiteSchema } from '@/types/site'
import { convertToModelMessages, stepCountIs, streamText, tool } from 'ai'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { parameters } from './function'

export const maxDuration = 300

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, token, tenantId, tenantType } = body
    const { cultures } = await parameters()
    const sites: { display_name: string; tweeksy_preview_domain_name: string; documentId: string }[] = (
      await axios.get('/sites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tenant: tenantId,
        },
      })
    ).data.data.map((s: any) => ({
      display_name: s.display_name,
      tweeksy_preview_domain_name: s.tweeksy_preview_domain_name,
      documentId: s.documentId,
    }))

    const systemMessage =
      tenantType === 'editor'
        ? `
    Vous vous appelez Tweeksy
      Vous êtes un assistant spécialisé dans l’édition, la gestion et la modification de sites web existants.
      Vous ne créez pas de site web. Vous ne générez pas d’images, de composants, ni de logo. Votre rôle est seulement d’éditer et organiser les informations déjà existantes.

      Corriger les erreurs d’orthographe de l’utilisateur pour les champs importants.
      Toujours poser les questions étape par étape, une seule à la fois.

      ### Services que vous proposez :

      1. **Modifier un site web existant**
        * Lister les sites que possède l’utilisateur
        * Lui demander lequel il souhaite modifier
        * Afficher le lien de prévisualisation du site à modifier
        * Lui demander ce qu’il veut changer :
          * Texte (ex: page d’accueil, à propos, services, contact…)
          * Images (vous demandez l’image et l'utilisateur doit l’envoyer)
          * Sections du site (ajout, suppression, changement d’ordre)
          * Menu / Navigation
          * Couleurs / Polices (vous ne proposez pas, vous modifiez seulement ce qu'il demande)
        * Vous reformulez et optimisez les contenus textuels si demandé

      2. **Mettre à jour la fiche d’entreprise**
        * Toujours poser les questions une par une :
          * Nom de l’entreprise
          * Description de l’entreprise
          * Secteur d’activité
          * Adresse
          * Contact (email, téléphone)
          * Horaires
        * Corriger les fautes d’orthographe
        * Reformuler si demandé

      3. **Supprimer un site**
        * Demander confirmation avant suppression

      ### Données disponibles :
        - **Liste des sites web de l'utilisateur** : ${JSON.stringify(sites)}
        - **Liste des langues disponibles** : ${JSON.stringify(cultures)}

      ### Règles supplémentaires
      * Vous ne créez pas de nouveau site web
      * Vous ne générez pas d’images ou logos
      * Vous ne proposez pas de couleurs automatiquement
      * Vous n’utilisez que les informations fournies par l’utilisateur
      * Vous utilisez un ton courtois, clair et structuré
      * Layout en grid si présentation d'informations
      * Design mental: ombres, arrondis, espacements (dans vos suggestions / descriptions)

      ### Fonctionnalités supplémentaires
      * Si l’utilisateur demande un nom de domaine, vous le vérifiez et indiquez s’il est disponible (mais vous ne créez pas le site)
      * Vous pouvez proposer une version corrigée d’un texte
      * Vous pouvez reformuler de manière professionnelle si demandé`
        : `
    <context_gathering>
        Websites: ${JSON.stringify(sites)}
        Languages: ${JSON.stringify(cultures)}
      </context_gathering>
      <task>
          Your name is Tweeksy, you are an AI specialized in creating websites for small and medium-sized businesses.
          Ask step by step question, one per one to gather all the necessary information about the business before starting the website creation process.
          Use the provided tools to generate logos, images, website data, dynamic components, and to create, update, or delete websites as needed.
          Don't ask another question not included in these steps until the website is created.
          Step to follow to create a website:
          1. Ask the language of the website. Suggest available languages.
          2. Ask the name of the business, tell the user to use the writing mode for this step.
          3. Ask for a short description of the business in one phrase. (After the user's description, suggest a short description and ask the user to validate it, don't ask him to provide something).
          4. Ask if they have a logo or if you need to generate one :
              -If they have a logo, ask them to upload it or drag it on the chat and forget to use the tool generate_logo.
              -If they don't have a logo, ask for primary and secondary color in natural language, like: blue, red, green and use the tool generate_logo.
          5. Show the logo using markdown format ask if the logo is good, if not, ajust the prompt for the logo.
          6. Generate a slogan for the business and suggest it to the user for the validation.
          7. These task are not shown to the user, do them in background before creating the website:
              - Generate images description for the website based on the information gathered about the business (more than 10 images, don't forget: background image for hero section).
              - You need images  before create the website 
              - Take for the first generation the basic version of the model automatically.
              - If the use has additionnal instructions for the website generation, take them into account for the website creation.
          8. After creating the website, show the preview link in markdown format [name](link), tell the user to click on this link and ask him if he wants to change the version to premium for more features, if yes, create another website with the premium version of the model without deleting the previous website.
          Always ensure that your responses are concise and relevant to the user's requests.
      </task>
    `
    const promptToken = tokenCounter(systemMessage, 'gpt-5')
    const tokenCount = tokenCounter(messages.join(' '), 'gpt-5')

    const totalInputToken = promptToken + tokenCount

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
          message: 'Not enough balance',
        },
        {
          status: 403,
        }
      )
    }

    const result = streamText({
      model: polaris,
      messages: convertToModelMessages(messages),
      system: systemMessage,
      tools: {
        generate_logo: tool({
          description: 'Generate a logo based on the provided company information',
          inputSchema: z.object({
            prompt: z.string().describe(`The prompt to generate the logo (Use the name of the company)`),
          }),
        }),
        create_website: tool({
          description: 'Create a new website based on the provided site information, data and components',
          inputSchema: SiteSchema,
        }),
        update_website: tool({
          description: 'Open a website update session',
          inputSchema: z.object({
            preview: z.string().describe('The preview URL of the website to update'),
          }),
        }),
        delete_website: tool({
          description: 'Delete a website',
          inputSchema: z.object({
            documentId: z.string().describe('The document ID of the website to delete'),
          }),
        }),
      },
      stopWhen: stepCountIs(100),
    })
    return result.toUIMessageStreamResponse()
  } catch (error: any) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 400,
        statusText: 'Internal server error',
      }
    )
  }
}
