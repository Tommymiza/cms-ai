import Avatar from "../utils/avatar";

export default function LoadingChat() {
  return (
    <div className="flex flex-row items-start gap-2 self-start text-wrap">
      <Avatar size={40} src="/images/Tweeksy-logo-HD.png" />
      <div className="rounded-md bg-white p-3 dark:bg-slate-300">
        <div className="loading-chat"></div>
      </div>
    </div>
  );
}
