import clsx from "clsx";
import { FaTrashCan } from "react-icons/fa6";

export default function DeleteIcon({ invert = false }: { invert?: boolean }) {
  return <FaTrashCan className={clsx("h-6 w-6 text-[var(--tweeksy)]")} />;
}
