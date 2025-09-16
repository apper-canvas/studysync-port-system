import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CalendarWidget = ({ assignments = [], courses = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.dueDate), date)
    );
  };
  
  const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
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
    return colorMap[course?.color] || "bg-primary";
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map(date => {
          const dayAssignments = getAssignmentsForDate(date);
          const isToday = isSameDay(date, new Date());
          
          return (
            <div
              key={date.toString()}
              className={`
                p-2 min-h-[3rem] border border-gray-100 rounded-lg
                ${isToday ? "bg-primary/10 border-primary" : "hover:bg-gray-50"}
                ${!isSameMonth(date, currentDate) ? "opacity-30" : ""}
              `}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : "text-gray-900"}`}>
                {format(date, "d")}
              </div>
              <div className="space-y-1">
                {dayAssignments.slice(0, 2).map(assignment => (
                  <div
                    key={assignment.Id}
                    className={`
                      w-full h-2 rounded-full ${getCourseColor(assignment.courseId)}
                      ${assignment.completed ? "opacity-50" : ""}
                    `}
                    title={assignment.title}
                  />
                ))}
                {dayAssignments.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayAssignments.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarWidget;