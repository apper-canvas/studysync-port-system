import React, { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAssignment = () => {
    setSelectedAssignment(null);
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

const handleSaveAssignment = async (assignmentData) => {
    try {
      if (selectedAssignment) {
        const updatedAssignment = await assignmentService.update(selectedAssignment.Id, assignmentData);
        setAssignments(prev => 
          prev.map(assignment => 
            assignment.Id === selectedAssignment.Id 
              ? updatedAssignment
              : assignment
          )
        );
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save assignment");
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await assignmentService.delete(assignmentId);
        setAssignments(prev => prev.filter(assignment => assignment.Id !== assignmentId));
        toast.success("Assignment deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete assignment");
      }
    }
  };

  const handleToggleComplete = async (assignmentId) => {
    try {
      await assignmentService.toggleComplete(assignmentId);
      setAssignments(prev => 
prev.map(assignment => 
          assignment.Id === assignmentId 
            ? { ...assignment, completed_c: !assignment.completed_c }
            : assignment
        )
      );
      toast.success("Assignment status updated!");
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCourseFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };

  const getFilteredAssignments = () => {
return assignments.filter(assignment => {
      const course = courses.find(c => c.Id === assignment.course_id_c?.Id || assignment.course_id_c);
      const matchesSearch = assignment.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.description_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (course?.name_c || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCourse = !courseFilter || (assignment.course_id_c?.Id || assignment.course_id_c) === parseInt(courseFilter);
      const matchesPriority = !priorityFilter || assignment.priority_c === priorityFilter;
      
      let matchesStatus = true;
if (statusFilter === "completed") matchesStatus = assignment.completed_c;
      else if (statusFilter === "pending") matchesStatus = !assignment.completed_c && new Date(assignment.due_date_c) >= new Date();
      else if (statusFilter === "overdue") matchesStatus = !assignment.completed_c && new Date(assignment.due_date_c) < new Date();

      return matchesSearch && matchesCourse && matchesPriority && matchesStatus;
}).sort((a, b) => {
      // Sort by due date, with overdue first, then by priority
      const aDate = new Date(a.due_date_c);
      const bDate = new Date(b.due_date_c);
      const today = new Date();
      
      const aOverdue = aDate < today && !a.completed_c;
      const bOverdue = bDate < today && !b.completed;
      
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      
      // Then sort by due date
      if (aDate.getTime() !== bDate.getTime()) {
        return aDate - bDate;
      }
      
// Finally sort by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority_c] - priorityOrder[b.priority_c];
    });
  };

  const filteredAssignments = getFilteredAssignments();

  if (loading) return <Loading type="skeleton" message="Loading assignments..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
const overdueAssignments = assignments.filter(a => 
    !a.completed_c && new Date(a.due_date_c) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
          <p className="text-gray-600">Track and manage all your academic assignments.</p>
        </div>
        <Button onClick={handleAddAssignment} className="mt-4 lg:mt-0 flex items-center space-x-2">
          <ApperIcon name="Plus" size={18} />
          <span>Add Assignment</span>
        </Button>
      </div>

      {/* Stats */}
      {totalAssignments > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-success">{completedAssignments}</p>
              </div>
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-primary">{totalAssignments - completedAssignments}</p>
              </div>
              <ApperIcon name="Clock" size={24} className="text-primary" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overdue</p>
                <p className="text-2xl font-bold text-error">{overdueAssignments}</p>
              </div>
              <ApperIcon name="AlertTriangle" size={24} className="text-error" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        courseFilter={courseFilter}
        onCourseFilterChange={setCourseFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        courses={courses}
        onClearFilters={handleClearFilters}
      />

      {/* Assignments List */}
      {filteredAssignments.length === 0 ? (
        <Empty
          title={assignments.length === 0 ? "No assignments yet" : "No assignments match your filters"}
          description={
            assignments.length === 0 
              ? "Start organizing your academic life by adding your first assignment."
              : "Try adjusting your search terms or filters to find assignments."
          }
          icon="FileText"
          actionLabel={assignments.length === 0 ? "Add Your First Assignment" : "Clear Filters"}
          onAction={assignments.length === 0 ? handleAddAssignment : handleClearFilters}
        />
      ) : (
        <div className="space-y-4">
{filteredAssignments.map(assignment => {
            const course = courses.find(c => c.Id === (assignment.course_id_c?.Id || assignment.course_id_c));
            return (
              <AssignmentCard
                key={assignment.Id}
                assignment={assignment}
                course={course}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
                onToggleComplete={handleToggleComplete}
              />
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAssignment}
        assignment={selectedAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;