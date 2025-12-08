// Types pour la structure Block
interface Block {
  type: string
  content?: string
  props?: Record<string, string>
  children?: Block[]
}

/**
 * Convertit un attribut HTML en prop JSX
 * @param attrName - Le nom de l'attribut HTML
 * @returns Le nom de la prop JSX
 */
function htmlAttrToJsx(attrName: string): string {
  // Mapping des attributs HTML vers JSX
  const htmlToJsxMap: Record<string, string> = {
    // Attributs de base
    class: 'className',
    for: 'htmlFor',

    // Attributs de formulaire
    'accept-charset': 'acceptCharset',
    accesskey: 'accessKey',
    autocomplete: 'autoComplete',
    autofocus: 'autoFocus',
    autoplay: 'autoPlay',
    autosave: 'autoSave',
    checked: 'defaultChecked',
    contenteditable: 'contentEditable',
    contextmenu: 'contextMenu',
    enctype: 'encType',
    formaction: 'formAction',
    formenctype: 'formEncType',
    formmethod: 'formMethod',
    formnovalidate: 'formNoValidate',
    formtarget: 'formTarget',
    inputmode: 'inputMode',
    maxlength: 'maxLength',
    minlength: 'minLength',
    novalidate: 'noValidate',
    readonly: 'readOnly',
    spellcheck: 'spellCheck',

    // Attributs de tableau
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    colspan: 'colSpan',
    rowspan: 'rowSpan',

    // Attributs média
    allowfullscreen: 'allowFullScreen',
    crossorigin: 'crossOrigin',
    mediagroup: 'mediaGroup',
    playsinline: 'playsInline',
    poster: 'poster',
    preload: 'preload',

    // Attributs SVG
    'accent-height': 'accentHeight',
    'alignment-baseline': 'alignmentBaseline',
    'arabic-form': 'arabicForm',
    'baseline-shift': 'baselineShift',
    'cap-height': 'capHeight',
    'clip-path': 'clipPath',
    'clip-rule': 'clipRule',
    'color-interpolation': 'colorInterpolation',
    'color-interpolation-filters': 'colorInterpolationFilters',
    'color-profile': 'colorProfile',
    'color-rendering': 'colorRendering',
    'dominant-baseline': 'dominantBaseline',
    'enable-background': 'enableBackground',
    'fill-opacity': 'fillOpacity',
    'fill-rule': 'fillRule',
    'flood-color': 'floodColor',
    'flood-opacity': 'floodOpacity',
    'font-family': 'fontFamily',
    'font-size': 'fontSize',
    'font-size-adjust': 'fontSizeAdjust',
    'font-stretch': 'fontStretch',
    'font-style': 'fontStyle',
    'font-variant': 'fontVariant',
    'font-weight': 'fontWeight',
    'glyph-name': 'glyphName',
    'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
    'glyph-orientation-vertical': 'glyphOrientationVertical',
    'horiz-adv-x': 'horizAdvX',
    'horiz-origin-x': 'horizOriginX',
    'image-rendering': 'imageRendering',
    'letter-spacing': 'letterSpacing',
    'lighting-color': 'lightingColor',
    'marker-end': 'markerEnd',
    'marker-mid': 'markerMid',
    'marker-start': 'markerStart',
    'overline-position': 'overlinePosition',
    'overline-thickness': 'overlineThickness',
    'paint-order': 'paintOrder',
    'panose-1': 'panose1',
    'pointer-events': 'pointerEvents',
    'rendering-intent': 'renderingIntent',
    'shape-rendering': 'shapeRendering',
    'stop-color': 'stopColor',
    'stop-opacity': 'stopOpacity',
    'strikethrough-position': 'strikethroughPosition',
    'strikethrough-thickness': 'strikethroughThickness',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-miterlimit': 'strokeMiterlimit',
    'stroke-opacity': 'strokeOpacity',
    'stroke-width': 'strokeWidth',
    'text-anchor': 'textAnchor',
    'text-decoration': 'textDecoration',
    'text-rendering': 'textRendering',
    'underline-position': 'underlinePosition',
    'underline-thickness': 'underlineThickness',
    'unicode-bidi': 'unicodeBidi',
    'unicode-range': 'unicodeRange',
    'units-per-em': 'unitsPerEm',
    'v-alphabetic': 'vAlphabetic',
    'v-hanging': 'vHanging',
    'v-ideographic': 'vIdeographic',
    'v-mathematical': 'vMathematical',
    'vector-effect': 'vectorEffect',
    'vert-adv-y': 'vertAdvY',
    'vert-origin-x': 'vertOriginX',
    'vert-origin-y': 'vertOriginY',
    'word-spacing': 'wordSpacing',
    'writing-mode': 'writingMode',
    'x-height': 'xHeight',

    // Autres attributs courants
    datetime: 'dateTime',
    frameborder: 'frameBorder',
    hreflang: 'hrefLang',
    'http-equiv': 'httpEquiv',
    tabindex: 'tabIndex',
    usemap: 'useMap',
    srcdoc: 'srcDoc',
    srcset: 'srcSet',
    referrerpolicy: 'referrerPolicy',
    'data-id': 'dataId',
    'data-type': 'dataType',
  }

  // Si l'attribut est dans le mapping, retourner la version JSX
  if (htmlToJsxMap[attrName.toLowerCase()]) {
    return htmlToJsxMap[attrName.toLowerCase()]
  }

  // Pour les attributs data-* et aria-*, garder tel quel
  if (attrName.startsWith('data-') || attrName.startsWith('aria-')) {
    return attrName
  }

  // Pour les autres attributs, convertir en camelCase si nécessaire
  if (attrName.includes('-')) {
    return attrName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  }

  return attrName
}

/**
 * Parse un HTML string et le transforme en structure JSON
 * Conforme au BlockSchema avec support de dataType et dataId pour les composants dynamiques
 * @param htmlString - Le HTML à parser
 * @returns La structure JSON selon le BlockSchema
 */
export function htmlToJson(htmlString: string): Block {
  // Créer un parser DOM
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')

  /**
   * Convertit un nœud DOM en objet Block
   * @param node - Le nœud DOM à convertir
   * @returns L'objet Block ou null si le nœud doit être ignoré
   */
  function nodeToBlock(node: Node): Block | null {
    // Ignorer les nœuds vides ou commentaires
    if (node.nodeType === Node.COMMENT_NODE) {
      return null
    }

    // Gérer les nœuds textuels
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim() || ''
      if (!text) return null

      return {
        type: 'text',
        content: text,
      }
    }

    // Gérer les éléments
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const block: Block = {
        type: element.tagName.toLowerCase(),
      }

      // Extraire les props (attributs) et les convertir au format JSX
      if (element.attributes.length > 0) {
        block.props = {}
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i]
          const jsxPropName = htmlAttrToJsx(attr.name)
          block.props[jsxPropName] = attr.value
        }
      }

      // Gérer les balises avec contenu brut (style, script, etc.)
      const rawContentTags = ['style', 'script', 'code', 'pre']
      if (rawContentTags.includes(block.type)) {
        block.content = element.textContent || ''
        return block
      }

      // Traiter les enfants
      const children: Block[] = []
      let hasOnlyTextContent = true
      let textContent = ''

      for (let i = 0; i < node.childNodes.length; i++) {
        const childNode = node.childNodes[i]

        // Si c'est un nœud texte
        if (childNode.nodeType === Node.TEXT_NODE) {
          const text = childNode.textContent?.trim() || ''
          if (text) {
            textContent += childNode.textContent || ''
          }
        } else if (childNode.nodeType === Node.ELEMENT_NODE) {
          // Si on a un élément enfant, ce n'est plus du texte pur
          hasOnlyTextContent = false
          const childBlock = nodeToBlock(childNode)
          if (childBlock) {
            children.push(childBlock)
          }
        }
      }

      // Si l'élément ne contient que du texte (pas d'éléments enfants)
      if (hasOnlyTextContent && textContent.trim()) {
        block.content = textContent.trim()
      } else if (children.length > 0) {
        block.children = children
      }

      return block
    }

    return null
  }

  // Parser le body du document
  const bodyChildren: Block[] = []
  for (let i = 0; i < doc.body.childNodes.length; i++) {
    const block = nodeToBlock(doc.body.childNodes[i])
    if (block) {
      bodyChildren.push(block)
    }
  }

  // Si un seul élément racine, le retourner directement
  if (bodyChildren.length === 1) {
    return bodyChildren[0]
  }

  // Sinon, retourner un fragment
  return {
    type: 'fragment',
    children: bodyChildren,
  }
}

// Exemple d'utilisation
const htmlExample = `
  <div class="container" id="main">
    <h1>Titre principal</h1>
    <p>Un paragraphe avec du <strong>texte en gras</strong>.</p>
    <style>
      .container { padding: 20px; }
    </style>
    
    <!-- Composants dynamiques avec dataType et dataId -->
    <article dataType="ServiceItem" dataId="service-1" class="service-card">
      <h3>Développement Web</h3>
      <p>Création de sites web modernes et performants</p>
    </article>
    
    <div dataType="ProductItem" dataId="prod-123">
      <img src="product.jpg" alt="Produit">
      <h2>Mon Produit</h2>
      <span class="price">99€</span>
    </div>
    
    <section dataType="AvisClientItem" dataId="avis-5" data-rating="5">
      <p>Excellent service !</p>
      <cite>Jean Dupont</cite>
    </section>
  </div>
`
