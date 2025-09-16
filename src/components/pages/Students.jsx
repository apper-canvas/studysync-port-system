import React, { useState, useEffect } from 'react';
import StudentCard from '@/components/molecules/StudentCard';
import StudentModal from '@/components/organisms/StudentModal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import studentService from '@/services/api/studentService';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      if (selectedStudent) {
        const updatedStudent = await studentService.update(selectedStudent.Id, studentData);
        setStudents(prev => 
          prev.map(student => 
            student.Id === selectedStudent.Id 
              ? updatedStudent
              : student
          )
        );
        toast.success("Student updated successfully!");
      } else {
        const newStudent = await studentService.create(studentData);
        setStudents(prev => [...prev, newStudent]);
        toast.success("Student added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save student");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(student => student.Id !== studentId));
        toast.success("Student deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const getGradeLevelStats = () => {
    const stats = {};
    students.forEach(student => {
      const grade = student.grade_level_c || 'Unspecified';
      stats[grade] = (stats[grade] || 0) + 1;
    });
    return stats;
  };

  const filteredStudents = students.filter(student =>
    student.first_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade_level_c?.toString().includes(searchTerm)
  );

  if (loading) return <Loading message="Loading students..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const gradeLevelStats = getGradeLevelStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students</h1>
          <p className="text-gray-600">Manage student information and academic records.</p>
        </div>
        <Button onClick={handleAddStudent} className="mt-4 lg:mt-0 flex items-center space-x-2">
          <ApperIcon name="Plus" size={18} />
          <span>Add Student</span>
        </Button>
      </div>

      {/* Statistics */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-primary">{students.length}</p>
              </div>
              <ApperIcon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Grade Levels</p>
                <p className="text-2xl font-bold text-secondary">{Object.keys(gradeLevelStats).length}</p>
              </div>
              <ApperIcon name="Award" size={24} className="text-secondary" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Grade Level</p>
                <p className="text-2xl font-bold text-success">
                  {students.filter(s => s.grade_level_c).length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.grade_level_c || 0), 0) / students.filter(s => s.grade_level_c).length * 10) / 10
                    : 0
                  }
                </p>
              </div>
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search students by name, email, or grade level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Students Grid */}
      {filteredStudents.length === 0 ? (
        <Empty
          title={searchTerm ? "No students found" : "No students yet"}
          description={
            searchTerm 
              ? "Try adjusting your search terms to find students." 
              : "Start building your student directory by adding your first student."
          }
          icon="Users"
          actionLabel="Add Your First Student"
          onAction={searchTerm ? undefined : handleAddStudent}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <StudentCard
              key={student.Id}
              student={student}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      )}

      {/* Grade Level Summary */}
      {students.length > 0 && Object.keys(gradeLevelStats).length > 0 && (
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Grade Level Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Object.entries(gradeLevelStats)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className="text-2xl font-bold mb-1">{count}</div>
                  <div className="text-purple-100">Grade {grade}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStudent}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;