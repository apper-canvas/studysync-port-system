import React, { useState, useEffect } from "react";
import CourseCard from "@/components/molecules/CourseCard";
import CourseModal from "@/components/organisms/CourseModal";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError(err.message || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (selectedCourse) {
const updatedCourse = await courseService.update(selectedCourse.Id, courseData);
        setCourses(prev => 
          prev.map(course => 
            course.Id === selectedCourse.Id 
              ? updatedCourse
              : course
          )
        );
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save course");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? All associated assignments will remain but won't be linked to any course.")) {
      try {
        await courseService.delete(courseId);
        setCourses(prev => prev.filter(course => course.Id !== courseId));
        toast.success("Course deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete course");
      }
    }
  };

const getAssignmentCount = (courseId) => {
    return assignments.filter(assignment => (assignment.course_id_c?.Id || assignment.course_id_c) === courseId).length;
  };

const filteredCourses = courses.filter(course =>
    course.name_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.semester_c?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading type="skeleton" message="Loading courses..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
          <p className="text-gray-600">Manage your academic courses and track progress.</p>
        </div>
        <Button onClick={handleAddCourse} className="mt-4 lg:mt-0 flex items-center space-x-2">
          <ApperIcon name="Plus" size={18} />
          <span>Add Course</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search courses, instructors, or semesters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Empty
          title={searchTerm ? "No courses found" : "No courses yet"}
          description={
            searchTerm 
              ? "Try adjusting your search terms to find courses." 
              : "Start building your academic schedule by adding your first course."
          }
          icon="BookOpen"
          actionLabel="Add Your First Course"
          onAction={searchTerm ? undefined : handleAddCourse}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.Id}
              course={course}
              assignmentCount={getAssignmentCount(course.Id)}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      )}

      {/* Course Summary */}
      {courses.length > 0 && (
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">{courses.length}</div>
              <div className="text-purple-100">Total Courses</div>
            </div>
            <div className="text-center">
<div className="text-2xl font-bold mb-1">
                {courses.reduce((sum, course) => sum + (course.credits_c || 0), 0)}
              </div>
              <div className="text-purple-100">Total Credits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                {assignments.length}
              </div>
              <div className="text-purple-100">Total Assignments</div>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
        course={selectedCourse}
      />
    </div>
  );
};

export default Courses;