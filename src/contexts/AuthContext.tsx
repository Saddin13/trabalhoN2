import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Certificate } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password?: string) => void;
  logout: () => void;
  register: (name: string, email: string, passwordHash: string, role: 'student' | 'admin') => void;
  enrollCourse: (courseId: string) => void;
  completeLesson: (lessonId: string, courseId: string, totalLessons: number, courseTitle: string) => void;
  isAdmin: boolean;
  getAllUsers: () => User[]; // Para o admin ver
  issueCertificate: (courseId: string, courseTitle: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes, matriculasRes, progressoRes, certRes] = await Promise.all([
          fetch('http://localhost:3000/usuarios'),
          fetch('http://localhost:3000/matriculas'),
          fetch('http://localhost:3000/progresso_aulas'),
          fetch('http://localhost:3000/certificados')
        ]);
        
        if (!usersRes.ok) return; // Se a API não rodar, não quebra totalmente

        const dbUsers = await usersRes.json();
        const dbMatriculas = await matriculasRes.json();
        const dbProgresso = await progressoRes.json();
        const dbCertificados = await certRes.json();

        let mappedUsers: User[] = dbUsers.map((u: any) => ({
          id: u.id,
          name: u.NomeCompleto,
          email: u.Email,
          role: u.Role as 'student' | 'admin',
          enrolledCourses: dbMatriculas.filter((m: any) => m.ID_Usuario === u.id).map((m: any) => m.ID_Curso),
          completedLessons: dbProgresso.filter((p: any) => p.ID_Usuario === u.id && p.Status === 'Concluído').map((p: any) => p.ID_Aula),
          certificates: dbCertificados.filter((c: any) => c.ID_Usuario === u.id).map((c: any) => ({
            id: c.id,
            courseId: c.ID_Curso,
            courseTitle: 'Curso',
            issueDate: c.DataEmissao,
            verificationCode: c.CodigoVerificacao
          })),
          needsPasswordReset: u.SenhaHash === '12345',
          passwordHash: u.SenhaHash
        }));

        if (mappedUsers.length === 0) {
          const defaultAdmin: User = {
            id: 'admin-1',
            name: 'Administrador',
            email: 'admin@saddi.com',
            role: 'admin',
            enrolledCourses: [],
            completedLessons: [],
            certificates: [],
            needsPasswordReset: true,
            passwordHash: '12345'
          };
          mappedUsers = [defaultAdmin];
        }

        setUsers(mappedUsers);

        // Carregar sessão ativa
        const activeUserId = localStorage.getItem('saddi_active_user');
        if (activeUserId) {
          const found = mappedUsers.find(u => u.id === activeUserId);
          if (found) setUser(found);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do json-server:", error);
      }
    }
    loadData();
  }, []);

  const saveUsers = async (newUsers: User[], newUser?: User) => {
    setUsers(newUsers);
    
    // Sincroniza um usuário novo na API
    if (newUser) {
      try {
        await fetch('http://localhost:3000/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newUser.id,
            NomeCompleto: newUser.name,
            Email: newUser.email,
            SenhaHash: newUser.passwordHash || '123456',
            DataCadastro: new Date().toISOString(),
            Role: newUser.role
          })
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (user) {
      const updatedUser = newUsers.find(u => u.id === user.id);
      if (updatedUser) setUser(updatedUser);
    }
  };

  const login = (email: string, password?: string) => {
    const found = users.find(u => u.email === email);
    if (found) {
      if (password && found.passwordHash !== password) {
        showToast('Senha incorreta!', 'error');
        return;
      }
      setUser(found);
      localStorage.setItem('saddi_active_user', found.id);
      showToast('Login realizado com sucesso!', 'success');
    } else {
      showToast('Usuário não encontrado!', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('saddi_active_user');
    showToast('Logout realizado.', 'info');
  };

  const register = (name: string, email: string, passwordHash: string, role: 'student' | 'admin') => {
    if (users.find(u => u.email === email)) {
      showToast('Email já cadastrado!', 'error');
      return;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      enrolledCourses: [],
      completedLessons: [],
      certificates: [],
      needsPasswordReset: false,
      passwordHash
    };
    const newUsers = [...users, newUser];
    saveUsers(newUsers, newUser);
    
    // Auto-login após cadastro
    setUser(newUser);
    localStorage.setItem('saddi_active_user', newUser.id);
    showToast('Conta criada com sucesso!', 'success');
  };

  const enrollCourse = async (courseId: string) => {
    if (!user) return;
    if (user.enrolledCourses.includes(courseId)) return;
    
    try {
      await fetch('http://localhost:3000/matriculas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `mat-${Date.now()}`,
          ID_Usuario: user.id,
          ID_Curso: courseId,
          DataMatricula: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error(e);
    }

    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, enrolledCourses: [...u.enrolledCourses, courseId] };
      }
      return u;
    });
    saveUsers(updatedUsers);
  };

  const completeLesson = async (lessonId: string, courseId: string, totalLessons: number, courseTitle: string) => {
    if (!user) return;
    
    const isCompleted = user.completedLessons.includes(lessonId);
    let newCompleted = [...user.completedLessons];
    
    if (isCompleted) {
      newCompleted = newCompleted.filter(id => id !== lessonId);
    } else {
      newCompleted.push(lessonId);
      try {
        await fetch('http://localhost:3000/progresso_aulas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: `prog-${Date.now()}`,
            ID_Usuario: user.id,
            ID_Aula: lessonId,
            DataConclusao: new Date().toISOString(),
            Status: 'Concluído'
          })
        });
      } catch (e) {
        console.error(e);
      }
    }

    let updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, completedLessons: newCompleted };
      }
      return u;
    });
    
    saveUsers(updatedUsers);
  };

  const issueCertificate = async (courseId: string, courseTitle: string) => {
     if (!user) return;
     if (user.certificates.find(c => c.courseId === courseId)) return; // já possui

     const newCert: Certificate = {
       id: `cert-${Date.now()}`,
       courseId,
       courseTitle,
       issueDate: new Date().toISOString(),
       verificationCode: `VFY-${Math.floor(Math.random()*10000)}`
     };

     try {
       await fetch('http://localhost:3000/certificados', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           id: newCert.id,
           ID_Usuario: user.id,
           ID_Curso: courseId,
           CodigoVerificacao: `VFY-${Math.floor(Math.random()*10000)}`,
           DataEmissao: newCert.issueDate
         })
       });
     } catch(e) {
       console.error(e);
     }

     const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, certificates: [...u.certificates, newCert] };
      }
      return u;
    });
    saveUsers(updatedUsers);
  }

  const updatePassword = async (newPassword: string) => {
    if (!user) return;
    try {
      await fetch(`http://localhost:3000/usuarios/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SenhaHash: newPassword })
      });
      const updatedUser = { ...user, needsPasswordReset: false };
      setUser(updatedUser);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      showToast('Senha atualizada com sucesso!', 'success');
    } catch(e) {
      console.error(e);
      showToast('Erro ao atualizar senha.', 'error');
    }
  };

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
      issueCertificate,
      updatePassword
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
  return context as AuthContextType & { issueCertificate: (courseId: string, courseTitle: string) => void, updatePassword: (pwd: string) => void };
}
