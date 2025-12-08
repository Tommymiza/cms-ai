import clsx from "clsx";
import Link from "next/link";

type ButtonProps = {
  invert?: boolean;
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (React.ComponentPropsWithoutRef<"button"> & { href?: undefined })
);

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const classNames = clsx(
    "inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition cursor-pointer",
    invert ? "bg-text-color2 text-primary" : "text-text-color2 bg-accent",
    className
  );
  const inner = <span className="relative top-px">{children}</span>;

  if (typeof props.href === "undefined") {
    return (
      <button type="button" className={classNames} {...props}>
        {inner}
      </button>
    );
  }

  return (
    <Link className={classNames} {...props}>
      {inner}
    </Link>
  );
}
