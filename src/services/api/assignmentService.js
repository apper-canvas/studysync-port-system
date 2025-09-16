import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData];
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getByCourse(courseId) {
    await this.delay();
    return this.assignments.filter(assignment => assignment.courseId === parseInt(courseId));
  }

  async getById(id) {
    await this.delay();
    return this.assignments.find(assignment => assignment.Id === parseInt(id));
  }

  async create(assignmentData) {
    await this.delay();
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...this.assignments.map(a => a.Id), 0) + 1,
      completed: false,
      grade: null
    };
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay();
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      this.assignments[index] = { ...assignmentData, Id: parseInt(id) };
      return { ...this.assignments[index] };
    }
    throw new Error("Assignment not found");
  }

  async updateGrade(id, grade, maxPoints) {
    await this.delay();
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      this.assignments[index].grade = grade;
      this.assignments[index].maxPoints = maxPoints;
      return { ...this.assignments[index] };
    }
    throw new Error("Assignment not found");
  }

  async toggleComplete(id) {
    await this.delay();
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      this.assignments[index].completed = !this.assignments[index].completed;
      return { ...this.assignments[index] };
    }
    throw new Error("Assignment not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.assignments.findIndex(assignment => assignment.Id === parseInt(id));
    if (index !== -1) {
      const deletedAssignment = this.assignments.splice(index, 1)[0];
      return { ...deletedAssignment };
    }
    throw new Error("Assignment not found");
  }
}

export default new AssignmentService();