import React from "react";
import { format, differenceInDays } from "date-fns";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const AssignmentCard = ({ assignment, course, onEdit, onDelete, onToggleComplete }) => {
const dueDate = new Date(assignment.due_date_c);
  const daysUntilDue = differenceInDays(dueDate, new Date());
  
  const getDueDateStatus = () => {
    if (assignment.completed_c) return { color: "success", text: "Completed" };
    if (daysUntilDue < 0) return { color: "error", text: "Overdue" };
    if (daysUntilDue === 0) return { color: "warning", text: "Due Today" };
    if (daysUntilDue <= 3) return { color: "warning", text: `Due in ${daysUntilDue} day${daysUntilDue > 1 ? "s" : ""}` };
    return { color: "default", text: `Due in ${daysUntilDue} days` };
  };

  const dueDateStatus = getDueDateStatus();

  const priorityColors = {
    high: "high",
    medium: "medium", 
    low: "low"
  };

  const colorMap = {
    blue: "border-blue-500",
    green: "border-green-500",
    purple: "border-purple-500",
    red: "border-red-500",
    yellow: "border-yellow-500",
    indigo: "border-indigo-500",
    pink: "border-pink-500",
    orange: "border-orange-500"
  };

  return (
    <Card 
className={`p-6 border-l-4 ${colorMap[course?.color_c] || "border-primary"} ${
        assignment.completed ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
<h3 className={`font-bold text-lg ${assignment.completed_c ? "line-through text-gray-500" : "text-gray-900"}`}>
              {assignment.title_c}
            </h3>
            <Badge variant={priorityColors[assignment.priority_c]}>
              {assignment.priority_c?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-gray-600 text-sm mb-3">{assignment.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <ApperIcon name="BookOpen" size={16} className="mr-1" />
{course?.name_c || "Unknown Course"}
            </div>
            <div className="flex items-center">
              <ApperIcon name="Calendar" size={16} className="mr-1" />
              {format(dueDate, "MMM d, yyyy")}
            </div>
{assignment.grade_c !== null && assignment.grade_c !== undefined && (
              <div className="flex items-center">
                <ApperIcon name="Award" size={16} className="mr-1" />
                {assignment.grade_c}/{assignment.max_points_c}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Badge variant={dueDateStatus.color}>
            {dueDateStatus.text}
          </Badge>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(assignment)}
              className="p-1.5 text-gray-400 hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/10"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={() => onDelete(assignment.Id)}
              className="p-1.5 text-gray-400 hover:text-error transition-colors duration-200 rounded-lg hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant={assignment.completed ? "outline" : "primary"}
          size="sm"
          onClick={() => onToggleComplete(assignment.Id)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name={assignment.completed ? "RotateCcw" : "Check"} size={16} />
          <span>{assignment.completed ? "Mark Incomplete" : "Mark Complete"}</span>
        </Button>
      </div>
    </Card>
  );
};

export default AssignmentCard;