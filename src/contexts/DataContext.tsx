import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, LearningPath } from '../types';
import { COURSES_DATA } from '../data/coursesData';
import { PATHS_DATA } from '../data/pathsData';

interface DataContextType {
  courses: Course[];
  paths: LearningPath[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addPath: (path: LearningPath) => void;
  updatePath: (path: LearningPath) => void;
  deletePath: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);

  // Load from localStorage or initialize
  useEffect(() => {
    const savedCourses = localStorage.getItem('saddi_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(COURSES_DATA);
      localStorage.setItem('saddi_courses', JSON.stringify(COURSES_DATA));
    }

    const savedPaths = localStorage.getItem('saddi_paths');
    if (savedPaths) {
      setPaths(JSON.parse(savedPaths));
    } else {
      setPaths(PATHS_DATA);
      localStorage.setItem('saddi_paths', JSON.stringify(PATHS_DATA));
    }
  }, []);

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem('saddi_courses', JSON.stringify(newCourses));
  };

  const savePaths = (newPaths: LearningPath[]) => {
    setPaths(newPaths);
    localStorage.setItem('saddi_paths', JSON.stringify(newPaths));
  };

  const addCourse = (course: Course) => saveCourses([...courses, course]);
  const updateCourse = (updated: Course) => saveCourses(courses.map(c => c.id === updated.id ? updated : c));
  const deleteCourse = (id: string) => saveCourses(courses.filter(c => c.id !== id));

  const addPath = (path: LearningPath) => savePaths([...paths, path]);
  const updatePath = (updated: LearningPath) => savePaths(paths.map(p => p.id === updated.id ? updated : p));
  const deletePath = (id: string) => savePaths(paths.filter(p => p.id !== id));

  return (
    <DataContext.Provider value={{ courses, paths, addCourse, updateCourse, deleteCourse, addPath, updatePath, deletePath }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
