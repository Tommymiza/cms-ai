import { Avatar } from '../avatar'

export default function LoadingChat() {
  return (
    <div className="flex flex-row items-start gap-2 self-start text-wrap">
      <Avatar style={{ width: 40, height: 40, objectFit: 'cover' }} src="/users/Tweeksy-logo-HD.png" />
      <div className="rounded-md bg-white p-3 dark:bg-slate-300">
        <div className="loading-chat"></div>
      </div>
    </div>
  )
}
