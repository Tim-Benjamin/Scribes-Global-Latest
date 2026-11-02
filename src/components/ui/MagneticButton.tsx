import type { ReactNode } from "react";
import Magnetic from "../animation/Magnetic";
import Button from "./Button";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  variant = "primary",
  onClick,
}: MagneticButtonProps) {
  return (
    <Magnetic strength={0.18}>
      <Button
        variant={variant}
        onClick={onClick}
      >
        {children}
      </Button>
    </Magnetic>
  );
}