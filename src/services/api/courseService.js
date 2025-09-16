import coursesData from "@/services/mockData/courses.json";

class CourseService {
  constructor() {
    this.courses = [...coursesData];
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.courses];
  }

  async getById(id) {
    await this.delay();
    return this.courses.find(course => course.Id === parseInt(id));
  }

  async create(courseData) {
    await this.delay();
    const newCourse = {
      ...courseData,
      Id: Math.max(...this.courses.map(c => c.Id), 0) + 1
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, courseData) {
    await this.delay();
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      this.courses[index] = { ...courseData, Id: parseInt(id) };
      return { ...this.courses[index] };
    }
    throw new Error("Course not found");
  }

  async delete(id) {
    await this.delay();
    const index = this.courses.findIndex(course => course.Id === parseInt(id));
    if (index !== -1) {
      const deletedCourse = this.courses.splice(index, 1)[0];
      return { ...deletedCourse };
    }
    throw new Error("Course not found");
  }
}

export default new CourseService();