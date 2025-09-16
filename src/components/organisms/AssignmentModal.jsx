import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const AssignmentModal = ({ isOpen, onClose, onSave, assignment = null, courses = [] }) => {
const [formData, setFormData] = useState({
    title_c: "",
    description_c: "",
    course_id_c: "",
    due_date_c: "",
    priority_c: "medium",
    grade_c: "",
    max_points_c: 100,
    completed_c: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (assignment) {
setFormData({
        title_c: assignment.title_c || "",
        description_c: assignment.description_c || "",
        course_id_c: assignment.course_id_c?.Id || assignment.course_id_c || "",
        due_date_c: assignment.due_date_c ? format(new Date(assignment.due_date_c), "yyyy-MM-dd") : "",
        priority_c: assignment.priority_c || "medium",
        grade_c: assignment.grade_c !== null && assignment.grade_c !== undefined ? assignment.grade_c.toString() : "",
        max_points_c: assignment.max_points_c || 100,
        completed_c: assignment.completed_c || false
      });
    } else {
      setFormData({
        title: "",
        description: "",
        courseId: "",
        dueDate: "",
        priority: "medium",
        grade: "",
        maxPoints: 100,
        completed: false
      });
    }
    setErrors({});
  }, [assignment, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
const newErrors = {};
    if (!formData.title_c?.trim()) newErrors.title_c = "Assignment title is required";
    if (!formData.course_id_c) newErrors.course_id_c = "Course selection is required";
    if (!formData.due_date_c) newErrors.due_date_c = "Due date is required";
    if (formData.grade_c && (isNaN(formData.grade_c) || parseFloat(formData.grade_c) < 0)) {
      newErrors.grade_c = "Grade must be a valid number";
    }
    if (formData.max_points_c && (isNaN(formData.max_points_c) || parseFloat(formData.max_points_c) <= 0)) {
      newErrors.max_points_c = "Max points must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = {
        ...formData,
        grade_c: formData.grade_c ? parseFloat(formData.grade_c) : null,
        max_points_c: parseFloat(formData.max_points_c)
      };
      onSave(submitData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {assignment ? "Edit Assignment" : "Add New Assignment"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <Input
            label="Assignment Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="e.g., Final Project Presentation"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Assignment details..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Course"
              value={formData.courseId}
              onChange={(e) => handleChange("courseId", e.target.value)}
              error={errors.courseId}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
<option key={course.Id} value={course.Id}>
                  {course.name_c}
                </option>
              ))}
            </Select>

            <Select
              label="Priority"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Grade (Optional)"
              type="number"
              step="0.1"
              min="0"
              value={formData.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              error={errors.grade}
              placeholder="85.5"
            />

            <Input
              label="Max Points"
              type="number"
              min="1"
              value={formData.maxPoints}
              onChange={(e) => handleChange("maxPoints", e.target.value)}
              error={errors.maxPoints}
            />
          </div>

          {assignment && (
            <div className="flex items-center space-x-3">
              <input
type="checkbox"
                id="completed"
                checked={formData.completed_c}
                onChange={(e) => handleChange("completed_c", e.target.checked)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/20"
              />
              <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              {assignment ? "Update Assignment" : "Add Assignment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;