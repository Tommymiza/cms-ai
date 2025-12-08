import clsx from "clsx";
import React from "react";

type EditIconProps = { invert?: boolean } & React.SVGProps<SVGSVGElement>;

export default function EditIcon({
  invert,
  className,
  ...props
}: EditIconProps) {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={clsx("text-[var(--tweeksy)]", className)}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
