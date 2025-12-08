import { create } from "zustand";
import { UiItem } from "./type";

export const useUiStore = create<UiItem>((set) => ({
  voiceInstruct: true,
  showUpload: false,
  isDragging: false,
  bot: true,
  editBox: null,
  isAudioPermit: false,
  setIsAudioPermit: (isAudioPermit) => set({ isAudioPermit }),
  setBot: (bot: boolean) => set({ bot }),
  setVoiceInstruct: (voiceInstruct: boolean) => set({ voiceInstruct }),
  setUpload: (showUpload: boolean) => set({ showUpload }),
  setDragging: (isDragging: boolean) => set({ isDragging }),
  setEditBox: (editBox: string | null) => set({ editBox }),
}));
