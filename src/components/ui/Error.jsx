import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={36} className="text-error" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      
      {showRetry && onRetry && (
        <Button onClick={onRetry} className="flex items-center space-x-2">
          <ApperIcon name="RotateCcw" size={18} />
          <span>Try Again</span>
        </Button>
      )}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If the problem persists, please check your connection and try again.
        </p>
      </div>
    </div>
  );
};

export default Error;