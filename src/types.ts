export type CourseCategory = 'programming' | 'design' | 'data';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
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
