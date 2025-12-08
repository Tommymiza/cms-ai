import clsx from "clsx";
import React from "react";

type ToolBtnProps = {
  children: React.ReactNode;
  active?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;
export default function ToolBtn({ children, active, ...props }: ToolBtnProps) {
  return (
    <button
      type="button"
      {...props}
      className={clsx(
        active ? "bg-gray-200" : "",
        "rounded-md flex items-center p-2 hover:bg-gray-100 text-[var(--tweeksy)]"
      )}
    >
      {children}
    </button>
  );
}
