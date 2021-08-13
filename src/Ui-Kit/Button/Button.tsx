import { IButtonProps } from "./def";

const sizeClassNameMap = {
  sm: "border-2 p-2 rounded-md text-md",
  md: "border-2 p-4 rounded-lg text-lg",
  lg: "border-2 p-8 rounded-lg text-xl",
};

const variantClassNameMap = {
  primary:
    "border-primary bg-primary hover:border-secondary hover:bg-secondary",
  secondary:
    "border-secondary bg-secondary hover:border-primary hover:bg-primary",
  warning: "border-warning hover:border-danger bg-warning hover:bg-danger",
  danger: "border-danger hover:border-warning bg-danger hover:bg-warning",
};
const Button: React.FC<IButtonProps> = ({
  caption,
  onClick,
  variant = "secondary",
  size = "md",
  className = "",
}: IButtonProps) => {
  return (
    <button
      className={`${sizeClassNameMap[size]} ${variantClassNameMap[variant]} text-white ${className}`}
      onClick={onClick}
    >
      {caption}
    </button>
  );
};

export default Button;