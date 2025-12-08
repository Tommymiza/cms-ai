import { create } from 'zustand'
import { ChatStore } from './type'

const chatStore = create<ChatStore>((set, get) => ({
  open: false,
  toggle(state) {
    set({ open: state })
  },
}))

export default chatStore
