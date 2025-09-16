import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add Item",
  onAction,
  icon = "FileX"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={36} className="text-gray-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={18} />
          <span>{actionLabel}</span>
        </Button>
      )}
      
      <div className="mt-8 grid grid-cols-3 gap-4 opacity-50">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-16 h-16 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

export default Empty;