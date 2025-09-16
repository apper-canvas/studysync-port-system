import React from 'react';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'secondary';
    if (grade <= 5) return 'success';
    if (grade <= 8) return 'primary';
    return 'warning';
  };

  return (
    <Card className="p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {student.first_name_c?.charAt(0) || '?'}{student.last_name_c?.charAt(0) || ''}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {student.first_name_c} {student.last_name_c}
            </h3>
            {student.grade_level_c && (
              <Badge variant={getGradeColor(student.grade_level_c)} className="mt-1">
                Grade {student.grade_level_c}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
            className="text-gray-600 hover:text-primary"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(student.Id)}
            className="text-gray-600 hover:text-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {student.email_c && (
          <div className="flex items-center space-x-2 text-sm">
            <ApperIcon name="Mail" size={14} className="text-gray-400" />
            <span className="text-gray-600">{student.email_c}</span>
          </div>
        )}
        
        {student.phone_c && (
          <div className="flex items-center space-x-2 text-sm">
            <ApperIcon name="Phone" size={14} className="text-gray-400" />
            <span className="text-gray-600">{student.phone_c}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm">
          <ApperIcon name="Calendar" size={14} className="text-gray-400" />
          <span className="text-gray-600">Born: {formatDate(student.date_of_birth_c)}</span>
        </div>
        
        {student.address_c && (
          <div className="flex items-start space-x-2 text-sm">
            <ApperIcon name="MapPin" size={14} className="text-gray-400 mt-0.5" />
            <span className="text-gray-600 line-clamp-2">{student.address_c}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Student ID</span>
          <span className="font-medium text-gray-700">#{student.Id}</span>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;