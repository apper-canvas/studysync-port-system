import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, assignmentCount, onEdit, onDelete }) => {
  const colorMap = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    indigo: "bg-indigo-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500"
  };

  return (
    <Card hover className="p-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${colorMap[course.color] || "bg-primary"}`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl ${colorMap[course.color] || "bg-primary"} flex items-center justify-center text-white font-bold text-lg`}>
            {course.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">{course.name}</h3>
            <p className="text-gray-600 text-sm">{course.instructor}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(course)}
            className="p-1.5 text-gray-400 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/10"
          >
            <ApperIcon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(course.Id)}
            className="p-1.5 text-gray-400 hover:text-error transition-colors duration-200 rounded-lg hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Clock" size={16} className="mr-2" />
          {course.schedule}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="BookOpen" size={16} className="mr-2" />
            {course.credits} Credits
          </div>
          <Badge variant="primary">
            {assignmentCount} Assignment{assignmentCount !== 1 ? "s" : ""}
          </Badge>
        </div>
        
        <div className="pt-2">
          <Badge variant="default" className="text-xs">
            {course.semester}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;