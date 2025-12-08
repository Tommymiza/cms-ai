import axios from '@/lib/axios'
import { gpt5mini, openRouterObject } from '@/lib/model'
import { tokenCounter } from '@/lib/token-counter'
import { PageSchema } from '@/types/page'
import { generateObject, zodSchema } from 'ai'
import { NextResponse } from 'next/server'
import z from 'zod'

export const maxDuration = 800

const schema = z.object({
  style: z
    .string()
    .describe(
      'Contient les CSS en format raw, incluant les variables CSS globales de thème, les fonts (Google Fonts), et les classes personnalisées.'
    ),
  header: z.string().describe("HTML en format raw de l'en-tête du site"),
  components: z
    .array(
      z.record(
        z.string(),
        z.object({
          html: z.string().describe('Format HTML du composant'),
          placeholders: z.array(z.string()).describe('Les champs utilisés dans le composant'),
        })
      )
    )
    .describe('Les composants réutilisables du site web'),
  pages: z.array(PageSchema).describe('Les pages du site web (Toujours entouré dans un <main>)'),
  footer: z.string().describe('HTML en format raw du pied de page du site'),
})

export async function POST(request: Request) {
  try {
    const { site, token, tenantId } = await request.json()
    const systemMessage = `
    <context_gathering>
      Le nom de l'entreprise est : ${site.display_name}
      La description de l'entreprise est : ${site.description}
      Voici l'url du logo du site : ${site.logo}
      Voici les données structurées du site : ${JSON.stringify(site.data)}
      Vous pouvez inventer des informations manquantes si nécessaire pour la création du site web.
      Vous pouvez insérer des images libres de droits en rapport avec l'activité de l'entreprise.
      Vous pouvez générer des contenus textuels en rapport avec l'activité de l'entreprise.
    </context_gathering>
    `

    const taskPrompt = `
  <instructions>
  Vous êtes un(e) designer web senior et développeur(se) front-end.
   
  Votre mission :
  Générez le contenu complet et la structure d'un site web multi-pages strictement à partir des informations de l'entreprise fournies dans <context_gathering>.
  
  IMPORTANT : Vous devez créer au minimum 4-5 pages distinctes (et plus si l'activité le justifie) avec des designs modernes, épurés et professionnels.
  
  Tous les choix visuels (couleurs, ambiance, style, types de sections, structure) doivent découler exclusivement du sens et du ton de la description.
   
  ==================================================================
  ## 1. GÉNÉRATION DU THÈME (STRICTEMENT BASÉE SUR LA DESCRIPTION)
  ==================================================================

  Vous devez déduire :
  - le ton (clair ou sombre)
  - l'identité visuelle
  - la palette de couleurs
  - l'ambiance
  - la sensation typographique
  - les animations
  - les effets d'ombre
  entièrement à partir de la description de l'entreprise.
   
  ==================================================================
  ## 2. ARCHITECTURE MULTI-PAGES (OBLIGATOIRE)
  ==================================================================
  
  Vous devez générer plusieurs pages distinctes dans le tableau "pages". Chaque page doit avoir :
  - Un slug unique (ex: "/", "/about", "/services", "/contact", etc.)
  - Un title pour le SEO
  - Un content HTML complet enveloppé dans <main>
  
  ### Pages obligatoires minimum :
  
  1. **Page d'accueil** (slug: "/")
     - Section hero
     - Présentation courte de l'entreprise
     - Aperçu de 2-4 items des listes principales disponibles dans siteData
     - Call-to-action
  
  2. **Page À propos** (slug: "/about" ou "/a-propos")
     - Histoire de l'entreprise
     - Mission et valeurs
     - Contenu pertinent selon les listes disponibles dans siteData
     - Photos et visuels pertinents
  
  3. **Page Contact** (slug: "/contact")
     - Formulaire de contact (nom, email, message, téléphone)
     - Informations de contact si disponibles
     - Carte ou adresse si disponible
  
  ### Pages supplémentaires OBLIGATOIRES :
  
  Analysez siteData.lists et créez une page dédiée pour CHAQUE liste qui contient plusieurs items.
  Adaptez le slug et le titre selon le item_category et list_key de chaque liste.
  
  Exemples de pages possibles selon les listes :
  - Portfolio/Réalisations/Projets
  - Blog/Actualités/Articles
  - FAQ/Questions
  - Témoignages/Avis
  - Équipe/Team/À propos
  - Ou tout autre type de contenu présent dans siteData.lists
  
  ### Pages de détail pour les items (OBLIGATOIRE pour certains types) :
  
  Pour certains types de listes, vous DEVEZ créer des pages de détail individuelles pour chaque item.
  
  **Types nécessitant des pages de détail :**
  - Articles de blog/actualités
  - Projets/Portfolio/Réalisations
  - Études de cas
  - Produits (si descriptions détaillées)
  - Services (si descriptions détaillées)
  - Tout type de contenu riche nécessitant plus d'espace
  
  **Format des pages de détail (IMPORTANT) :**
  
  Les pages de détail utilisent le MÊME FORMAT que les composants avec des placeholders :
  
  1. **id** : Timestamp unique (ex: "1733404800001", "1733404800002")
  2. **parent_id** : Timestamp de la page liste parente
  3. **path** : Pattern avec placeholders (ex: /blog/ITEM_ID, /portfolio/ITEM_ID - remplacer ITEM_ID par des accolades avec id)
  4. **HTML** : Avec placeholders entre accolades pour les champs dynamiques
  5. **placeholders** : Liste des champs dynamiques
  6. **type** : Le list_key de la liste (ex: "blog_articles", "portfolio_projects")
  7. **show_menu** : false
  
  **Structure complète d'une page de détail :**
  
  Exemple pour un blog (remplacer les accolades par des vraies) :
  - id: "1733404800002"
  - parent_id: "1733404800001"
  - title: "Titre de l'article - Nom de l'entreprise" (avec placeholder pour title)
  - path: "/blog/ITEM_ID" (remplacer ITEM_ID par accolades+id)
  - type: "blog_articles"
  - show_menu: false
  - html: HTML avec placeholders entre accolades pour title, image, date, author, content
  - placeholders: ["id", "title", "image", "date", "author", "content"]
  - style: ""
  
  **Exemples concrets :**
  
  Page liste blog + page détail :
  
  - Page liste : id timestamp, parent_id null, path "/blog", type "standard", show_menu true
  - Page détail : id timestamp, parent_id pointant vers page liste, path avec placeholder id, type "blog_articles", show_menu false
  
  Page liste portfolio + page détail :
  
  - Page liste : id timestamp, parent_id null, path "/portfolio", type "standard", show_menu true  
  - Page détail : id timestamp, parent_id pointant vers page liste, path avec placeholder id, type "portfolio_projects", show_menu false
  
  **Règles importantes :**
  - Toutes les pages doivent avoir un id timestamp unique
  - Pages de détail : parent_id pointe vers le timestamp de la page liste correspondante
  - Pages standards : parent_id = null ou non défini
  - Une SEULE page template par type de liste (pas une page par item)
  - Utilisez des placeholders entre accolades pour tous les champs dynamiques
  
  **Types NE nécessitant PAS de pages de détail :**
  - Témoignages courts
  - Membres d'équipe (sauf si biographies longues)
  - FAQ simples
  - Logos partenaires
  - Éléments décoratifs
  
  ### Règles de distribution du contenu :
  
  1. **NE dupliquez PAS le contenu** : Chaque liste dynamique doit apparaître principalement sur UNE page thématique dédiée
  2. **Page d'accueil = Aperçu** : Montrez seulement 2-4 items des listes principales avec un lien "Voir plus"
  3. **Pages de liste = Tous les items** : Affichez TOUS les items avec liens vers pages de détail si applicable
  4. **Pages de détail = Template unique** : UNE page template par type de liste (pas une page par item)
  5. **Créez les pages dynamiquement** : Pour chaque liste dans siteData.lists, déterminez si elle mérite une page de détail
  
  ### Exemples de répartition avec pages de détail :
  
  Si siteData contient "blog_articles" avec schema { title, content, image, author, date } :
  - Page d'accueil (/) : 3 articles en aperçu + lien "Voir tous"
  - Page de liste (/blog) : Les 10 articles avec liens vers /blog/{id}
  - Page de détail (/blog/{id}) : UNE page template avec placeholders {title}, {content}, etc.
  
  Si siteData contient "portfolio_projects" avec schema { name, description, images } :
  - Page d'accueil (/) : 3 projets en aperçu
  - Page de liste (/portfolio) : Les 6 projets avec liens vers /portfolio/{id}
  - Page de détail (/portfolio/{id}) : UNE page template avec placeholders {name}, {description}, etc.
  
  Si siteData contient "home_testimonials" avec 8 témoignages :
  - Page d'accueil (/) : 3 témoignages
  - Page de liste (/temoignages) : Les 8 témoignages complets
  - Pas de page de détail (contenu court)
  
  IMPORTANT : 
  - Créez UNE page template par type de liste nécessitant du détail
  - Utilisez {id} dans le path et tous les champs du schema en placeholders
  - Le système remplacera automatiquement les placeholders pour chaque item
  
  ==================================================================
  ## 3. SECTION HERO (PAGE D'ACCUEIL UNIQUEMENT)
  ==================================================================
   
  La page d'accueil doit inclure une section hero bien en évidence.
   
  Elle doit contenir :
  - une image de fond pleine largeur directement pertinente à l'activité de l'entreprise, prenez une des images dans la liste des images
  - une couche de recouvrement pour la lisibilité (par ex. un overlay semi-transparent sombre ou clair)
  - un titre principal (H1)
  - un sous-titre descriptif
  - un ou plusieurs boutons d'appel à l'action
   
  La section hero établit l'identité visuelle déduite de la description.
   
  ==================================================================
  ## 4. EN-TÊTE (OBLIGATOIRE)
  ==================================================================
   
  L'en-tête doit :
  - inclure le logo de l'entreprise seulement (sans le nom ou description) en utilisant l'URL fournie
  - inclure des éléments de navigation pointant vers TOUTES les pages générées
  - Les liens de navigation doivent utiliser les slugs des pages (ex: href="/about", href="/services", href="/contact")
  - Faire attention au contraste entre le fond et le texte pour assurer la lisibilité (si le texte est clair, le fond doit être sombre et vice versa)
  - La navigation doit être cohérente et présente sur toutes les pages
  
  ### En-tête – Règles de taille du logo et de la hauteur de l'en-tête
   
  Vous devez adapter la hauteur de l'en-tête en fonction du rapport d'aspect du logo :
   
  - Le logo doit avoir un hauteur d'au moins 100px.
  - La mise en page de l'en-tête doit toujours rester équilibrée et alignée visuellement.
   
  ==================================================================
  ## 5. PIED DE PAGE (OBLIGATOIRE)
  ==================================================================
   
  Le pied de page doit :
  - inclure des informations structurées pertinentes pour l'entreprise
  - inclure les informations de contact si elles sont disponibles dans <context_gathering>
  - inclure les liens vers les réseaux sociaux si disponibles
  - inclure des liens vers les pages principales du site
  - être visuellement distinct du contenu principal tout en préservant la lisibilité et contraste entre le fond et le texte. (si le texte est clair, le fond doit être sombre et vice versa)
   
  ==================================================================
  ## 6. LISTES DYNAMIQUES - IMPORTANT
  ==================================================================
  
  Les données structurées sont dans siteData.lists. Chaque liste contient :
  - list_key : identifiant de la liste
  - item_category : type de contenu
  - items : tableau d'objets, chaque item a un ID unique
  
  ### Syntaxe d'insertion :
  
  Pour chaque item individuel d'une liste, utilisez :
  <div data-type="LIST_KEY" data-id="ITEM_ID"></div>
  
  ### Exemples d'utilisation :
  
  Pour afficher le témoignage avec ID "item_1733404800001" de la liste "home_testimonials" :
  <div data-type="home_testimonials" data-id="item_1733404800001"></div>
  
  Pour afficher un membre d'équipe avec ID "item_1733404800002" de la liste "about_team" :
  <div data-type="about_team" data-id="item_1733404800002"></div>
  
  Pour afficher un service avec ID "item_1733404800003" de la liste "services_list" :
  <div data-type="services_list" data-id="item_1733404800003"></div>
  
  ### Règles strictes :
  
  1. data-type = le list_key de la liste (ex: "home_testimonials")
  2. data-id = l'ID unique de l'item spécifique (ex: "item_1733404800001")
  3. Chaque item d'une liste doit avoir sa propre balise avec son ID unique
  4. NE générez JAMAIS le contenu HTML manuellement
  5. Tous les IDs des items sont fournis dans siteData.lists[].items[].id
  
  ### Structure complète d'une section :
  
  <section class="py-16">
    <h2>Témoignages</h2>
    <div class="grid md:grid-cols-3 gap-8">
      <div data-type="home_testimonials" data-id="item_1733404800001"></div>
      <div data-type="home_testimonials" data-id="item_1733404800002"></div>
      <div data-type="home_testimonials" data-id="item_1733404800003"></div>
    </div>
  </section>
  
  Vous devez parcourir les items de chaque liste dans siteData et créer une balise pour chacun.
  
  ==================================================================
  ## 7. COMPOSANTS DYNAMIQUES - GÉNÉRATION DU DESIGN
  ==================================================================
  
  Pour chaque liste dans siteData.lists, vous devez générer le design HTML/Tailwind du composant dans la clé "components".
  
  ### Structure des composants :
  
  La clé "components" est un tableau d'objets où chaque objet représente une liste :
  
  {
    "list_key_ici": {
      "html": "<div class='...'>{title}</div><p class='...'>{description}</p>...",
      "placeholders": ["title", "description", "image", ...]
    }
  }
  
  ### Règles de génération :
  
  1. Pour chaque liste (ex: "home_testimonials"), créez un objet dans components avec son list_key
  2. Le champ "html" contient le design complet du composant en Tailwind CSS
  3. Utilisez des placeholders entre accolades {field_name} pour les champs dynamiques
  4. Le champ "placeholders" liste tous les placeholders utilisés dans le HTML
  5. Les placeholders doivent correspondre aux champs définis dans le schema de la liste
  
  ### Exemples :
  
  Pour une liste "home_testimonials" avec schema { name, role, comment, photo } :
  
  {
    "home_testimonials": {
      "html": "<div class='bg-white rounded-lg shadow-lg p-6'><img src='{photo}' alt='{name}' class='w-16 h-16 rounded-full mx-auto mb-4'/><p class='text-gray-600 italic mb-4'>\"{comment}\"</p><p class='font-semibold text-center'>{name}</p><p class='text-sm text-gray-500 text-center'>{role}</p></div>",
      "placeholders": ["photo", "comment", "name", "role"]
    }
  }
  
  Pour une liste "services_list" avec schema { title, description, icon } :
  
  {
    "services_list": {
      "html": "<div class='border border-gray-200 rounded-xl p-8 hover:shadow-xl transition-shadow'><div class='text-4xl mb-4'>{icon}</div><h3 class='text-xl font-bold mb-3'>{title}</h3><p class='text-gray-600'>{description}</p></div>",
      "placeholders": ["icon", "title", "description"]
    }
  }
  
  ### Design des composants :
  
  - Utilisez Tailwind CSS exclusivement
  - Le design doit être cohérent avec le thème global du site
  - Adaptez le design au type de contenu (testimonial, service, team member, etc.)
  - Incluez les states hover/focus si approprié
  - Assurez la responsivité avec les classes Tailwind (sm:, md:, lg:)
  - Respectez la hiérarchie visuelle et les espacements
  
  IMPORTANT : Tous les champs du schema de chaque liste doivent être utilisés dans les placeholders.
  
  ==================================================================
  ## 8. EXIGENCES TECHNIQUES & UI
  ==================================================================
   
  - Tailwind CSS pour tous les styles
  - Flexbox/Grid pour les mises en page
  - Espacement cohérent (padding, margin, gap)
  - Hiérarchie visuelle claire et contraste optimal
  - Design moderne et épuré
  - Responsive design (mobile-first)
  - Pour chaque item : <div data-type="list_key" data-id="item_id"></div>
  - Générez le design de chaque composant dans la clé "components"
  - Assurez-vous que TOUTES les pages ont le même style/thème cohérent
   
  ${site.additionnal_prompt ? `- Instructions supplémentaires : ${site.additionnal_prompt}` : ''}

  ==================================================================
  ## 9. FORMAT DE SORTIE (STRICT)
  ==================================================================
  
  RAPPEL IMPORTANT :
  - Pages fixes : Accueil, À propos, Contact (avec IDs timestamps uniques)
  - Pages de liste : Une par liste dans siteData.lists (avec IDs timestamps)
  - Pages de détail : UNE page template par type (avec IDs timestamps)
  
  **Structure obligatoire de TOUTES les pages :**
  - id: Timestamp unique en string (ex: "1733404800001", "1733404800002")
  - parent_id: Timestamp de la page parente (null pour pages standards, timestamp pour pages de détail)
  - path: Chemin unique ("/", "/blog", "/blog/{id}")
  - title: Titre SEO (peut contenir {placeholders})
  - type: "standard" pour pages normales, OU le list_key (ex: "blog_articles", "portfolio_projects") pour pages de détail
  - show_menu: true pour pages dans menu, false pour pages de détail
  - html: Contenu HTML (avec {placeholders} pour pages de détail)
  - placeholders: Array de champs dynamiques (pour pages de détail)
  - style: CSS spécifique à la page
  
  **Règle importante pour le champ type :**
  - Pages standards (accueil, à propos, contact, listes) : type = "standard"
  - Pages de détail : type = list_key de la liste correspondante (ex: si liste "blog_articles", alors type = "blog_articles")
  - Cela permet d'identifier facilement quelle liste correspond à quelle page de détail
  
  **Génération des IDs timestamps :**
  - Utilisez des timestamps uniques pour chaque page (ex: 1733404800001, 1733404800002, etc.)
  - Incrémentez le timestamp pour chaque nouvelle page
  - Les pages de détail doivent référencer le timestamp de leur page parente dans parent_id
  
  Total attendu : 5-10 pages selon le contenu (fixes + listes + templates de détail)
   
  La sortie finale DOIT respecter ce schéma :
   
  ## Schéma de sortie
  ${JSON.stringify(zodSchema(schema, { useReferences: true }))}

  - Vous pouvez générer du contenu textuel et des images libres de droits liées à l'activité.
  </instructions>
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
      return NextResponse.json(e, {
        status: 403,
      })
    }

    const model = site.version === 'premium' ? gpt5mini : openRouterObject

    const result = await generateObject({
      model: model,
      maxOutputTokens: site.version === 'premium' ? 128000 : 32000,
      system: systemMessage,
      prompt: taskPrompt,
      schema: zodSchema(schema, { useReferences: true }),
    })

    const totalOutputToken = tokenCounter(JSON.stringify(result), 'gpt-5')

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
