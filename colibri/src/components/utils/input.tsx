import clsx from "clsx";
import React, { forwardRef } from "react";

export const Input = forwardRef(function Input(
  {
    className,
    ...props
  }: {
    className?: string;
    type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  } & React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      ref={ref}
      {...props}
      className={clsx([
        className,
        "relative block w-full",
        "rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-blue-500/50",
        "shadow-sm",
      ])}
    />
  );
});
