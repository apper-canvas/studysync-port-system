import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { differenceInDays } from "date-fns";
import StatCard from "@/components/molecules/StatCard";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import CalendarWidget from "@/components/molecules/CalendarWidget";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleComplete = async (id) => {
    try {
      await assignmentService.toggleComplete(id);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.Id === id 
            ? { ...assignment, completed: !assignment.completed }
            : assignment
        )
      );
      toast.success("Assignment status updated!");
    } catch (err) {
      toast.error("Failed to update assignment status");
    }
  };

  if (loading) return <Loading type="skeleton" message="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate stats
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.completed).length;
  const pendingAssignments = totalAssignments - completedAssignments;
  const overdueAssignments = assignments.filter(a => 
    !a.completed && new Date(a.dueDate) < new Date()
  ).length;
  
  const completionRate = totalAssignments > 0 
    ? Math.round((completedAssignments / totalAssignments) * 100)
    : 0;

  // Get upcoming assignments (next 7 days, not completed)
  const upcomingAssignments = assignments
    .filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      const daysUntil = differenceInDays(dueDate, new Date());
      return !assignment.completed && daysUntil >= 0 && daysUntil <= 7;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  // Calculate average grade
  const gradedAssignments = assignments.filter(a => a.grade !== null && a.grade !== undefined);
  const averageGrade = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((sum, a) => sum + (a.grade / a.maxPoints * 100), 0) / gradedAssignments.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your academic overview.</p>
        </div>
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate("/courses")} variant="outline">
            <ApperIcon name="BookOpen" size={18} className="mr-2" />
            Manage Courses
          </Button>
          <Button onClick={() => navigate("/assignments")}>
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Assignment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={courses.length}
          subtitle="Active this semester"
          icon="BookOpen"
          gradient="primary"
        />
        <StatCard
          title="Pending Assignments"
          value={pendingAssignments}
          subtitle={`${completedAssignments} completed`}
          icon="FileText"
          gradient="warning"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle={`${completedAssignments}/${totalAssignments} done`}
          icon="CheckCircle"
          gradient="success"
        />
        <StatCard
          title="Average Grade"
          value={averageGrade > 0 ? `${averageGrade}%` : "N/A"}
          subtitle={`${gradedAssignments.length} graded items`}
          icon="Award"
          gradient="secondary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Assignments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Assignments</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/assignments")}
              >
                View All
              </Button>
            </div>

            {upcomingAssignments.length === 0 ? (
              <Empty
                title="No upcoming assignments"
                description="Great job! You don't have any assignments due in the next 7 days."
                icon="CheckCircle"
                actionLabel="View All Assignments"
                onAction={() => navigate("/assignments")}
              />
            ) : (
              <div className="space-y-4">
                {upcomingAssignments.map(assignment => {
                  const course = courses.find(c => c.Id === assignment.courseId);
                  return (
                    <AssignmentCard
                      key={assignment.Id}
                      assignment={assignment}
                      course={course}
                      onEdit={() => navigate("/assignments")}
                      onDelete={() => navigate("/assignments")}
                      onToggleComplete={handleToggleComplete}
                    />
                  );
                })}
              </div>
            )}

            {overdueAssignments > 0 && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-2 text-red-700">
                  <ApperIcon name="AlertTriangle" size={20} />
                  <span className="font-semibold">
                    You have {overdueAssignments} overdue assignment{overdueAssignments !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-1">
          <CalendarWidget assignments={assignments} courses={courses} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Quick Actions</h3>
        <p className="text-purple-100 mb-4">
          Get organized and stay on top of your academic goals
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate("/assignments")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ApperIcon name="Plus" size={18} className="mr-2" />
            Add Assignment
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/courses")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ApperIcon name="BookOpen" size={18} className="mr-2" />
            Add Course
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/grades")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ApperIcon name="Award" size={18} className="mr-2" />
            View Grades
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;