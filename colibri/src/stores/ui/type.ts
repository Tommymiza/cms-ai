export type UiItem = {
  voiceInstruct: boolean;
  isDragging: boolean;
  showUpload: boolean;
  editBox: string | null;
  bot: boolean;
  isAudioPermit: boolean;
  setIsAudioPermit: (isAudioPermit: boolean) => void;
  setBot: (bot: boolean) => void;
  setVoiceInstruct: (voiceInstruct: boolean) => void;
  setUpload: (showUpload: boolean) => void;
  setDragging: (isDragging: boolean) => void;
  setEditBox: (editBox: string | null) => void;
};
