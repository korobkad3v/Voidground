import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "px-4 py-2 bg-accent text-primary-foreground rounded-md transition-colors duration-300 cursor-pointer",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-foreground hover:text-primary",
        className
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

