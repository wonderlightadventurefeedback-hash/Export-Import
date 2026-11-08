import React from "react";
import { cn } from "../../utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

export const Container: React.FC<ContainerProps> = ({
  className,
  size = "default",
  children,
  ...props
}) => {
  const sizeClasses = {
    narrow: "max-w-4xl",
    default: "max-w-[1280px]",
    wide: "max-w-[1440px]",
    full: "max-w-none",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
