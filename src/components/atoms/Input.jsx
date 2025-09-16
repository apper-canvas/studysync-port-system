import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  const isCurrency = type === "currency";
  const inputType = isCurrency ? "text" : type;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className={cn("relative", isCurrency && "")}>
        {isCurrency && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            $
          </div>
        )}
        <input
          type={inputType}
          inputMode={isCurrency ? "decimal" : undefined}
          pattern={isCurrency ? "[0-9]*\\.?[0-9]{0,2}" : undefined}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200",
            isCurrency && "pl-8",
            error && "border-error focus:ring-error/20 focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;