import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import GradeModal from "@/components/organisms/GradeModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import courseService from "@/services/api/courseService";
import assignmentService from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Grades = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

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
      setError(err.message || "Failed to load grades");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddGrade = (assignment) => {
    setSelectedAssignment(assignment);
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = async (gradeData) => {
    try {
      await assignmentService.updateGrade(selectedAssignment.Id, gradeData.grade, gradeData.maxPoints);
      setAssignments(prev => 
        prev.map(assignment => 
          assignment.Id === selectedAssignment.Id 
            ? { ...assignment, grade: gradeData.grade, maxPoints: gradeData.maxPoints }
            : assignment
        )
      );
      toast.success("Grade saved successfully!");
      setIsGradeModalOpen(false);
    } catch (err) {
      toast.error("Failed to save grade");
    }
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

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return "success";
    if (percentage >= 80) return "primary";
    if (percentage >= 70) return "warning";
    return "error";
  };

  const getCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => 
      a.courseId === courseId && a.grade !== null && a.grade !== undefined
    );
    
    if (courseAssignments.length === 0) return null;
    
    const totalWeightedScore = courseAssignments.reduce((sum, assignment) => 
      sum + (assignment.grade / assignment.maxPoints * 100), 0);
    
    return Math.round(totalWeightedScore / courseAssignments.length);
  };

  const getOverallGPA = () => {
    const gradedCourses = courses.map(course => {
      const grade = getCourseGrade(course.Id);
      return { course, grade };
    }).filter(item => item.grade !== null);

    if (gradedCourses.length === 0) return null;

    const totalPoints = gradedCourses.reduce((sum, item) => {
      const gpa = item.grade >= 97 ? 4.0 :
                  item.grade >= 93 ? 4.0 :
                  item.grade >= 90 ? 3.7 :
                  item.grade >= 87 ? 3.3 :
                  item.grade >= 83 ? 3.0 :
                  item.grade >= 80 ? 2.7 :
                  item.grade >= 77 ? 2.3 :
                  item.grade >= 73 ? 2.0 :
                  item.grade >= 70 ? 1.7 :
                  item.grade >= 67 ? 1.3 :
                  item.grade >= 65 ? 1.0 : 0.0;
      return sum + (gpa * item.course.credits);
    }, 0);

    const totalCredits = gradedCourses.reduce((sum, item) => sum + item.course.credits, 0);
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
  };

  const filteredAssignments = selectedCourse === "all" 
    ? assignments 
    : assignments.filter(a => a.courseId === parseInt(selectedCourse));

  if (loading) return <Loading type="skeleton" message="Loading grades..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const overallGPA = getOverallGPA();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Grades</h1>
          <p className="text-gray-600">Track your academic performance and GPA.</p>
        </div>
      </div>

      {/* GPA Overview */}
      {overallGPA && (
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Overall GPA</h2>
            <div className="text-5xl font-bold mb-2">{overallGPA}</div>
            <p className="text-purple-100">
              Based on {courses.filter(course => getCourseGrade(course.Id) !== null).length} courses
            </p>
          </div>
        </div>
      )}

      {/* Course Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">Filter by course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course.Id} value={course.Id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Course Grades Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map(course => {
          const courseGrade = getCourseGrade(course.Id);
          const courseAssignments = assignments.filter(a => a.courseId === course.Id);
          const gradedAssignments = courseAssignments.filter(a => a.grade !== null && a.grade !== undefined);
          
          const colorMap = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
            purple: "from-purple-500 to-purple-600",
            red: "from-red-500 to-red-600",
            yellow: "from-yellow-500 to-yellow-600",
            indigo: "from-indigo-500 to-indigo-600",
            pink: "from-pink-500 to-pink-600",
            orange: "from-orange-500 to-orange-600"
          };

          return (
            <Card key={course.Id} className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[course.color] || "from-primary to-purple-600"} flex items-center justify-center text-white font-bold`}>
                  {course.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.credits} Credits</p>
                </div>
              </div>
              
              {courseGrade !== null ? (
                <div className="text-center py-4">
                  <div className="text-3xl font-bold gradient-text mb-2">{courseGrade}%</div>
                  <Badge variant={getGradeColor(courseGrade)} className="mb-2">
                    {getLetterGrade(courseGrade)}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    {gradedAssignments.length} of {courseAssignments.length} assignments graded
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Award" size={24} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No grades yet</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Assignments Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Assignment Grades</h2>
        
        {filteredAssignments.length === 0 ? (
          <Empty
            title="No assignments found"
            description="No assignments match your current filter selection."
            icon="FileText"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Assignment</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Grade</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Letter</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map(assignment => {
                  const course = courses.find(c => c.Id === assignment.courseId);
                  const hasGrade = assignment.grade !== null && assignment.grade !== undefined;
                  const percentage = hasGrade ? Math.round((assignment.grade / assignment.maxPoints) * 100) : null;
                  
                  return (
                    <tr key={assignment.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{assignment.title}</div>
                        {assignment.completed && (
                          <Badge variant="success" className="mt-1">Completed</Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {course?.name || "Unknown Course"}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        {hasGrade ? (
                          <span className="font-semibold">
                            {assignment.grade}/{assignment.maxPoints}
                          </span>
                        ) : (
                          <span className="text-gray-400">Not graded</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {hasGrade && (
                          <Badge variant={getGradeColor(percentage)}>
                            {getLetterGrade(percentage)}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddGrade(assignment)}
                        >
                          {hasGrade ? "Edit" : "Add"} Grade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Grade Modal */}
      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        onSave={handleSaveGrade}
        assignment={selectedAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Grades;