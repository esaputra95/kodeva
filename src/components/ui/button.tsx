import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonStyles = cva("button", {
  variants: {
    variant: {
      primary: "button-primary",
      secondary: "button-secondary",
      ghost: "button-ghost",
      light: "button-light",
    },
    size: { default: "", small: "button-small" },
  },
  defaultVariants: { variant: "primary", size: "default" },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonStyles> & {
    href: string;
    children: ReactNode;
  };

export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return <Link href={href} className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
