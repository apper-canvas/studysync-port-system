import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, subtitle, icon, gradient = "primary" }) => {
  const gradients = {
    primary: "from-primary to-purple-600",
    secondary: "from-secondary to-indigo-600",
    success: "from-success to-green-600",
    warning: "from-accent to-yellow-600",
    error: "from-error to-red-600"
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className={`absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradients[gradient]} opacity-10`} />
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 gradient-text mb-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center text-white`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;