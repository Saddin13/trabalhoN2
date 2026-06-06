import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Certificate } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string) => void;
  logout: () => void;
  register: (name: string, email: string, role: 'student' | 'admin') => void;
  enrollCourse: (courseId: string) => void;
  completeLesson: (lessonId: string, courseId: string, totalLessons: number, courseTitle: string) => void;
  isAdmin: boolean;
  getAllUsers: () => User[]; // Para o admin ver
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Carregar usuários do localStorage
    const savedUsers = localStorage.getItem('saddi_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Cria um admin padrão se não houver usuários
      const defaultAdmin: User = {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@saddi.com',
        role: 'admin',
        enrolledCourses: [],
        completedLessons: [],
        certificates: []
      };
      setUsers([defaultAdmin]);
      localStorage.setItem('saddi_users', JSON.stringify([defaultAdmin]));
    }

    // Carregar sessão ativa
    const activeUserId = localStorage.getItem('saddi_active_user');
    if (activeUserId && savedUsers) {
      const allUsers: User[] = JSON.parse(savedUsers);
      const found = allUsers.find(u => u.id === activeUserId);
      if (found) setUser(found);
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('saddi_users', JSON.stringify(newUsers));
    
    // Atualiza o estado do usuário ativo se ele estiver na lista modificada
    if (user) {
      const updatedUser = newUsers.find(u => u.id === user.id);
      if (updatedUser) setUser(updatedUser);
    }
  };

  const login = (email: string) => {
    const found = users.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('saddi_active_user', found.id);
    } else {
      alert('Usuário não encontrado!');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saddi_active_user');
  };

  const register = (name: string, email: string, role: 'student' | 'admin') => {
    if (users.find(u => u.email === email)) {
      alert('Email já cadastrado!');
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      enrolledCourses: [],
      completedLessons: [],
      certificates: []
    };
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    
    // Auto-login após cadastro
    setUser(newUser);
    localStorage.setItem('saddi_active_user', newUser.id);
  };

  const enrollCourse = (courseId: string) => {
    if (!user) return;
    if (user.enrolledCourses.includes(courseId)) return;
    
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, enrolledCourses: [...u.enrolledCourses, courseId] };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  const completeLesson = (lessonId: string, courseId: string, totalLessons: number, courseTitle: string) => {
    if (!user) return;
    
    const isCompleted = user.completedLessons.includes(lessonId);
    let newCompleted = [...user.completedLessons];
    
    if (isCompleted) {
      newCompleted = newCompleted.filter(id => id !== lessonId);
    } else {
      newCompleted.push(lessonId);
    }

    // Verificar se o curso foi concluído 100% para gerar certificado
    // Aqui assumimos que completedLessons pode conter lessons de outros cursos.
    // O certo seria contar quantas lessons ESSE courseId tem no newCompleted,
    // mas precisaremos de acesso ao DataContext para saber quais lessons pertencem a esse curso.
    // Como isso fica complexo aqui, vamos simplificar no CourseDetail e passar as lessons completadas.
    // Na verdade, a chamada recebe lessonId e nós adicionamos/removemos.
    // A checagem de certificado pode ser feita aqui: passamos as lessons deste curso que já estavam completas
    
    let updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, completedLessons: newCompleted };
      }
      return u;
    });
    
    saveUsers(updatedUsers);
  };

  // Precisamos de uma função separada para emitir certificado, pois depende dos dados do curso
  const issueCertificate = (courseId: string, courseTitle: string) => {
     if (!user) return;
     if (user.certificates.find(c => c.courseId === courseId)) return; // já possui

     const newCert: Certificate = {
       id: `cert-${Date.now()}`,
       courseId,
       courseTitle,
       issueDate: new Date().toISOString()
     };

     const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, certificates: [...u.certificates, newCert] };
      }
      return u;
    });
    saveUsers(updatedUsers);
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      users,
      login, 
      logout, 
      register, 
      enrollCourse, 
      completeLesson,
      isAdmin: user?.role === 'admin',
      getAllUsers: () => users,
      // @ts-ignore
      issueCertificate
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType & { issueCertificate: (courseId: string, courseTitle: string) => void };
}
