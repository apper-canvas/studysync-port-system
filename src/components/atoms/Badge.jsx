import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-gradient-to-r from-primary/10 to-purple-100 text-primary border border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-indigo-100 text-secondary border border-secondary/20",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20",
    warning: "bg-gradient-to-r from-accent/10 to-yellow-100 text-accent border border-accent/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20",
    high: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200",
    medium: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200",
    low: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;