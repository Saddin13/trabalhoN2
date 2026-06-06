export type CourseCategory = 'programming' | 'design' | 'data';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string; // YouTube URL
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  description: string;
  longDescription: string;
  rating: number;
  studentsCount: number;
  modulesCount: number;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  image: string;
  instructorName: string;
  instructorRole: string;
  instructorBio: string;
  modules: Module[];
}

// NOVO: Sistema de Usuários e Autenticação
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrolledCourses: string[]; // array de course.id
  completedLessons: string[]; // array de lesson.id
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
}

// NOVO: Sistema de Trilhas
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  coursesIds: string[]; // Ordem dos cursos na trilha
}
