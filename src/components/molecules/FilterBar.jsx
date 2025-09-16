import React from "react";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  courseFilter, 
  onCourseFilterChange, 
  priorityFilter, 
  onPriorityFilterChange, 
  statusFilter, 
  onStatusFilterChange, 
  courses = [],
  onClearFilters
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Select
            value={courseFilter}
            onChange={(e) => onCourseFilterChange(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.Id} value={course.Id}>
                {course.name}
              </option>
            ))}
          </Select>
          
          <Select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          
          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="X" size={16} />
            <span>Clear</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;