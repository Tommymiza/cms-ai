export const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    // Ne pas oublier de stopper le stream après la permission accordée
    stream.getTracks().forEach((track) => track.stop())
  } catch (error) {
    console.error('Permission microphone refusée ou erreur :', error)
    window.location.reload()
  }
}
