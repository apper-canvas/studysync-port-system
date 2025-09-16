import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("month");

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
      setError(err.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const getAssignmentsForDate = (date) => {
    return assignments.filter(assignment => 
      isSameDay(new Date(assignment.due_date_c), date)
    );
  };

const getCourseColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    const colorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500"
    };
    return colorMap[course?.color] || "bg-primary";
  };

const getCourseTextColor = (courseId) => {
    const course = courses.find(c => c.Id === courseId);
    const colorMap = {
      blue: "text-blue-700",
      green: "text-green-700",
      purple: "text-purple-700",
      red: "text-red-700",
      yellow: "text-yellow-700",
      indigo: "text-indigo-700",
      pink: "text-pink-700",
      orange: "text-orange-700"
    };
    return colorMap[course?.color] || "text-primary";
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
          {daysInCalendar.map(date => {
            const dayAssignments = getAssignmentsForDate(date);
            const isToday = isSameDay(date, new Date());
            const isCurrentMonth = isSameMonth(date, currentDate);

            return (
              <div
                key={date.toString()}
                className={`
                  bg-white p-3 min-h-[120px] relative
                  ${isToday ? "bg-primary/5 ring-2 ring-primary/20" : ""}
                  ${!isCurrentMonth ? "opacity-40" : ""}
                `}
              >
                <div className={`text-sm font-semibold mb-2 ${isToday ? "text-primary" : "text-gray-900"}`}>
                  {format(date, "d")}
                </div>
                
                <div className="space-y-1">
{dayAssignments.slice(0, 3).map(assignment => {
                    const course = courses.find(c => c.Id === (assignment.course_id_c?.Id || assignment.course_id_c));
                    return (
                      <div
key={assignment.Id}
                        className={`
                          text-xs p-1 rounded ${getCourseColor(assignment.course_id_c?.Id || assignment.course_id_c)} text-white
                          ${assignment.completed ? "opacity-60 line-through" : ""}
                          truncate cursor-pointer hover:opacity-80 transition-opacity
                        `}
                        title={`${assignment.title} - ${course?.name || "Unknown Course"}`}
                      >
                        {assignment.title}
                      </div>
                    );
                  })}
                  {dayAssignments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center font-medium">
                      +{dayAssignments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUpcomingAssignments = () => {
const upcomingAssignments = assignments
      .filter(assignment => new Date(assignment.due_date_c) >= new Date())
      .sort((a, b) => new Date(a.due_date_c) - new Date(b.due_date_c))
      .slice(0, 10);
    return (
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Assignments</h3>
        <div className="space-y-3">
          {upcomingAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming assignments</p>
          ) : (
            upcomingAssignments.map(assignment => {
              const course = courses.find(c => c.Id === assignment.courseId);
              const dueDate = new Date(assignment.dueDate);
              const today = new Date();
              const daysUntil = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

              return (
<div
                  key={assignment.Id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{assignment.title_c}</h4>
                    <p className="text-sm text-gray-600">{course?.name_c || "Unknown Course"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {format(dueDate, "MMM d")}
                    </p>
                    <Badge variant={daysUntil === 0 ? "warning" : daysUntil <= 3 ? "error" : "default"}>
                      {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    );
  };

  if (loading) return <Loading type="skeleton" message="Loading calendar..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">View your assignments and deadlines at a glance.</p>
        </div>
        
        {/* Calendar Navigation */}
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </Button>
            <div className="text-lg font-semibold text-gray-900 min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-gray-700">Course Colors:</span>
        {courses.slice(0, 6).map(course => (
<div key={course.Id} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getCourseColor(course.Id)}`} />
            <span className="text-sm text-gray-700">{course.name_c}</span>
          </div>
        ))}
        {courses.length > 6 && (
          <span className="text-sm text-gray-500">+{courses.length - 6} more</span>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          {renderMonthView()}
        </div>
        <div className="xl:col-span-1">
          {renderUpcomingAssignments()}
        </div>
      </div>

      {/* Calendar Statistics */}
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">This Month Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
{assignments.filter(a => {
                const dueDate = new Date(a.due_date_c);
                return dueDate.getMonth() === currentDate.getMonth() && 
                       dueDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <div className="text-purple-100 text-sm">Assignments Due</div>
          </div>
          <div className="text-center">
<div className="text-2xl font-bold mb-1">
              {assignments.filter(a => {
                const dueDate = new Date(a.due_date_c);
                return a.completed_c && 
                       dueDate.getMonth() === currentDate.getMonth() && 
                       dueDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <div className="text-purple-100 text-sm">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {courses.length}
            </div>
            <div className="text-purple-100 text-sm">Active Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;