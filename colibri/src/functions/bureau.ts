import { useBureauStore } from '@/stores/bureau'
import { useSiteStore } from '@/stores/site'
import { toast } from 'sonner'

export default function bureauTool() {
  const {
    createBureau,
    updateBureau: updateBureauStore,
    deleteBureau: deleteBureauStore,
    searchBureau,
  } = useBureauStore()

  const { site } = useSiteStore()
  const addBureau = async (toolCall: any) => {
    const args = toolCall.input
    try {
      const bureau = await createBureau(args)
      toast.success('Le bureau a bien été ajouté')
      return bureau
    } catch (error: any) {
      console.log(error)
      toast.error('Une erreur est survenue lors de l’ajout du bureau')
      throw new Error('Une erreur est survenue lors de l’ajout du bureau')
    }
  }

  const updateBureau = async (toolCall: any) => {
    const args = toolCall.input
    try {
      await updateBureauStore(args)
      toast.success('Le bureau a bien été modifié')
    } catch (error: any) {
      console.log(error)
      toast.error('Une erreur est survenue lors de la modification du bureau')
      throw new Error(
        "Une erreur s'est produite lors de la modification du bureau",
      )
    }
  }

  const deleteBureau = async (toolCall: any) => {
    const args = toolCall.input
    try {
      await deleteBureauStore(args.documentId)
      toast.success('Le bureau a bien été supprimé')
    } catch (error: any) {
      console.log(error)
      toast.error('Une erreur est survenue lors de la suppression du bureau')
      throw new Error(
        "Une erreur s'est produite lors de la suppression du bureau",
      )
    }
  }

  const retrieveBureau = async (toolCall: any) => {
    const args = toolCall.input
    try {
      const bureaus = await searchBureau(args.search, site?.id)
      return bureaus
    } catch (error: any) {
      console.log(error)
      throw new Error('Aucun bureau trouvé')
    }
  }

  return {
    addBureau,
    updateBureau,
    deleteBureau,
    retrieveBureau,
  }
}
