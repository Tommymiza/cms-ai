export type UiStoreItem = {
  voiceInstruct: boolean
  isListening: boolean
  isPlaying: boolean
  isRecording: boolean
  isFileLoading: boolean
  showUpload: boolean
  isAudioPermit: boolean
  setUpload: (showUpload: boolean) => void
  setVoiceInstruct: (voiceInstruct: boolean) => void
  setIsListening: (isListening: boolean) => void
  setIsPlaying: (isPlaying: boolean) => void
  setIsRecording: (isRecording: boolean) => void
  setIsFileLoading: (isFileLoading: boolean) => void
  setIsAudioPermit: (isAudioPermit: boolean) => void
}
