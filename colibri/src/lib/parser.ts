import Bold from '@tiptap/extension-bold'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
// Configuration de l'éditeur Tiptap

export const parseParagraph = (obj: any, key: string) => {
  try {
    const content = new Editor({
      extensions: [StarterKit, Bold, TextStyle, Color, Link],
      content: JSON.parse(obj[key]),
    }).getText()
    try {
      const t = JSON.parse(content)
      obj[key] = content
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    throw 'Il y a un problème sur le format richtext, je vais essayer de le corriger'
  }
}

export const parseTitle = (obj: any, key: string) => {
  try {
    console.log(obj[key])
    const content = new Editor({
      extensions: [StarterKit, Bold, TextStyle, Color, Link],
      content: JSON.parse(obj[key]),
    }).getText()
    console.log(content)
    try {
      const t = JSON.parse(content)
      obj[key] = content
    } catch (error) {
      console.log(error)
    }
  } catch (error) {
    console.log(error)
    throw 'Il y a un problème sur le format richtext, je vais essayer de le corriger'
  }
}
