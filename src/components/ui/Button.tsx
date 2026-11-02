import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { useHaptics } from "../../hooks/useHaptics";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  ...props
}: ButtonProps) {
  const { light } = useHaptics();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    light();
    onClick?.(event);
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`sg-button sg-button-${variant} ${
        props.className ?? ""
      }`}
    >
      <span>{children}</span>
    </button>
  );
}