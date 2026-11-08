import React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  className,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-ivory-300/80 rounded-[2px]",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded-[2px] my-1",
        className
      )}
      {...props}
    />
  );
};
