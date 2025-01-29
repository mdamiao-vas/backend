import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-500 hover:bg-gray-600 text-white";
      case "outline":
        return "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors ${getVariantClasses()}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
