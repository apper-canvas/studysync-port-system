import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';

const StudentModal = ({ isOpen, onClose, onSave, student }) => {
  const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    email_c: '',
    phone_c: '',
    date_of_birth_c: '',
    address_c: '',
grade_level_c: '',
    gender_c: '',
    amount_paid_c: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.first_name_c || '',
        last_name_c: student.last_name_c || '',
        email_c: student.email_c || '',
        phone_c: student.phone_c || '',
        date_of_birth_c: student.date_of_birth_c || '',
        address_c: student.address_c || '',
grade_level_c: student.grade_level_c?.toString() || '',
        gender_c: student.gender_c || '',
        amount_paid_c: student.amount_paid_c?.toString() || ''
      });
    } else {
      setFormData({
        first_name_c: '',
        last_name_c: '',
        email_c: '',
        phone_c: '',
        date_of_birth_c: '',
        address_c: '',
grade_level_c: '',
        gender_c: '',
        amount_paid_c: ''
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = 'First name is required';
    }
    
    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = 'Last name is required';
    }
    
    if (!formData.email_c.trim()) {
      newErrors.email_c = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address';
    }
    
    if (formData.grade_level_c && (isNaN(formData.grade_level_c) || formData.grade_level_c < 1 || formData.grade_level_c > 12)) {
      newErrors.grade_level_c = 'Grade level must be between 1 and 12';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {student ? 'Edit Student' : 'Add Student'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name *"
              name="first_name_c"
              value={formData.first_name_c}
              onChange={handleInputChange}
              error={errors.first_name_c}
              placeholder="Enter first name"
            />
            <Input
              label="Last Name *"
              name="last_name_c"
              value={formData.last_name_c}
              onChange={handleInputChange}
              error={errors.last_name_c}
              placeholder="Enter last name"
            />
          </div>

          <Input
            label="Email *"
            name="email_c"
            type="email"
            value={formData.email_c}
            onChange={handleInputChange}
            error={errors.email_c}
            placeholder="Enter email address"
          />

          <Input
            label="Phone"
            name="phone_c"
            type="tel"
            value={formData.phone_c}
            onChange={handleInputChange}
            error={errors.phone_c}
            placeholder="Enter phone number"
          />

          <Input
            label="Date of Birth"
            name="date_of_birth_c"
            type="date"
            value={formData.date_of_birth_c}
            onChange={handleInputChange}
            error={errors.date_of_birth_c}
/>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <Select
              name="grade_level_c"
              value={formData.grade_level_c}
              onChange={handleInputChange}
              className={errors.grade_level_c ? 'border-error focus:ring-error/20 focus:border-error' : ''}
            >
              <option value="">Select grade level</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Grade {i + 1}
                </option>
              ))}
            </Select>
            {errors.grade_level_c && (
              <p className="mt-1 text-sm text-error">{errors.grade_level_c}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <Select
              name="gender_c"
              value={formData.gender_c}
              onChange={handleInputChange}
              className={errors.gender_c ? 'border-error focus:ring-error/20 focus:border-error' : ''}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
            {errors.gender_c && (
              <p className="mt-1 text-sm text-error">{errors.gender_c}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address_c"
              value={formData.address_c}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter student address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
/>
          </div>
<div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Paid
            </label>
            <Input
              type="currency"
              name="amount_paid_c"
              value={formData.amount_paid_c}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
              <span>{student ? 'Update' : 'Add'} Student</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;