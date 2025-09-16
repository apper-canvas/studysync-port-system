import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const CourseModal = ({ isOpen, onClose, onSave, course = null }) => {
const [formData, setFormData] = useState({
    name_c: "",
    instructor_c: "",
    credits_c: 3,
    schedule_c: "",
    semester_c: "",
    color_c: "blue"
  });

  const [errors, setErrors] = useState({});

  const colors = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" }
  ];

  useEffect(() => {
if (course) {
      setFormData({
        name_c: course.name_c || "",
        instructor_c: course.instructor_c || "",
        credits_c: course.credits_c || 3,
        schedule_c: course.schedule_c || "",
        semester_c: course.semester_c || "",
        color_c: course.color_c || "blue"
      });
    } else {
      setFormData({
        name: "",
        instructor: "",
        credits: 3,
        schedule: "",
        semester: "",
        color: "blue"
      });
    }
    setErrors({});
  }, [course, isOpen]);

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
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.instructor.trim()) newErrors.instructor = "Instructor is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    if (!formData.semester.trim()) newErrors.semester = "Semester is required";
    if (formData.credits < 1 || formData.credits > 6) newErrors.credits = "Credits must be between 1 and 6";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        credits_c: parseInt(formData.credits_c)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {course ? "Edit Course" : "Add New Course"}
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
            label="Course Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            placeholder="e.g., Introduction to Computer Science"
          />

          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => handleChange("instructor", e.target.value)}
            error={errors.instructor}
            placeholder="e.g., Dr. Smith"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Credits"
              type="number"
              min="1"
              max="6"
              value={formData.credits}
              onChange={(e) => handleChange("credits", e.target.value)}
              error={errors.credits}
            />

            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
              error={errors.semester}
            >
              <option value="">Select Semester</option>
              <option value="Spring 2024">Spring 2024</option>
              <option value="Summer 2024">Summer 2024</option>
              <option value="Fall 2024">Fall 2024</option>
              <option value="Spring 2025">Spring 2025</option>
            </Select>
          </div>

          <Input
            label="Schedule"
            value={formData.schedule}
            onChange={(e) => handleChange("schedule", e.target.value)}
            error={errors.schedule}
            placeholder="e.g., MWF 10:00 AM - 11:00 AM"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Course Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange("color", color.value)}
                  className={`
                    w-full h-12 rounded-lg border-2 transition-all duration-200
                    ${color.class}
${formData.color_c === color.value ? "border-gray-800 scale-105" : "border-transparent"}
                  `}
                  title={color.label}
                />
              ))}
            </div>
          </div>

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
              {course ? "Update Course" : "Add Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;