import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

const GradeModal = ({ isOpen, onClose, onSave, assignment = null, courses = [] }) => {
  const [formData, setFormData] = useState({
grade: "",
    max_points_c: 100
  });

  const [errors, setErrors] = useState({});

const course = courses.find(c => c.Id === (assignment?.course_id_c?.Id || assignment?.course_id_c));

  useEffect(() => {
if (assignment) {
      setFormData({
        grade: assignment.grade_c !== null && assignment.grade_c !== undefined ? assignment.grade_c.toString() : "",
        max_points_c: assignment.max_points_c || 100
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
    if (!formData.grade) {
      newErrors.grade = "Grade is required";
    } else if (isNaN(formData.grade) || parseFloat(formData.grade) < 0) {
      newErrors.grade = "Grade must be a valid number";
    } else if (parseFloat(formData.grade) > parseFloat(formData.maxPoints)) {
      newErrors.grade = "Grade cannot exceed max points";
    }
    if (!formData.maxPoints || isNaN(formData.maxPoints) || parseFloat(formData.maxPoints) <= 0) {
      newErrors.maxPoints = "Max points must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
onSave({
        grade: parseFloat(formData.grade),
        maxPoints: parseFloat(formData.max_points_c)
      });
    }
  };

  const calculatePercentage = () => {
    if (formData.grade && formData.maxPoints) {
      const percentage = (parseFloat(formData.grade) / parseFloat(formData.maxPoints)) * 100;
      return percentage.toFixed(1);
    }
    return null;
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
  };

  if (!isOpen || !assignment) return null;

  const percentage = calculatePercentage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Add Grade
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
<h3 className="font-semibold text-gray-900 mb-1">{assignment.title_c}</h3>
            <p className="text-sm text-gray-600">{course?.name_c}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Grade"
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

            {percentage && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Percentage:</span>
                  <span className="font-bold text-primary">{percentage}%</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Letter Grade:</span>
                  <span className="font-bold text-primary">{getLetterGrade(parseFloat(percentage))}</span>
                </div>
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
                Save Grade
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeModal;