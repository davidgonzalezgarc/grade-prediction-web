export interface CourseListPage {
  totalPages: number
  content: Course[]
}

export type Course = {
  id: string
  name: string
  schoolYear: number
}

export interface StudentListPage {
  totalPages: number
  content: Student[]
}

export type Student = {
  id: string
  name: string
  email: string
}

export interface TeacherListPage {
  totalPages: number
  content: Teacher[]
}

export type Teacher = {
  id: string
  name: string
  email: string
}

export type StudentInformation = {
  id: string
  sex: string
  age: number
  address: string
  familySize: string
  parentsStatus: string
  motherEducation: number
  fatherEducation: number
  motherJob: string
  fatherJob: string
  extraCurricularActivities: boolean
  romanticRelationship: boolean
  freeTime: number
  goOut: number
  workdayAlcohol: number
  weekendAlcohol: number
  healthStatus: number
}

export type StudentCourseInformation = {
  travelTime: number
  weeklyStudyTime: number
  failures: number
  extraEducationalSupport: boolean
  familyEducationalSupport: boolean
  extraPaidClasses: boolean
  absences: number
}

export interface GradeListPage {
  totalPages: number
  content: CourseStudentGrades[]
}

export type CourseStudentGrades = {
  student: Student
  grades: StudentGrade[]
}

export type StudentGrade = {
  id: {
    studentId: string
    gradeItemId: string
    schoolYear: number
  }
  grade: number
}

export type GradeItem = {
  id: string
  name: string
  percentage: number
}

export type Prediction = {
  prediction: number
}
