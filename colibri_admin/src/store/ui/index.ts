import { create } from 'zustand'
import { UiStoreItem } from './type'

export const useUiStore = create<UiStoreItem>((set) => ({
  voiceInstruct: false,
  isListening: false,
  isPlaying: false,
  isRecording: false,
  isFileLoading: false,
  showUpload: false,
  isAudioPermit: false,
  setUpload: (showUpload) => set({ showUpload }),
  setVoiceInstruct: (voiceInstruct) => set({ voiceInstruct }),
  setIsListening: (isListening) => set({ isListening }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsRecording: (isRecording) => set({ isRecording }),
  setIsFileLoading: (isFileLoading) => set({ isFileLoading }),
  setIsAudioPermit: (isAudioPermit) => set({ isAudioPermit }),
}))
