import { User } from '../types';
import { getSession, setSession } from './authService';

const API_URL = 'http://localhost:3000';

export async function enrollCourse(courseId: string) {
  const user = getSession();
  if (!user) return;
  if (user.enrolledCourses.includes(courseId)) return;

  await fetch(`${API_URL}/matriculas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `mat-${Date.now()}`,
      ID_Usuario: user.id,
      ID_Curso: courseId,
      DataMatricula: new Date().toISOString()
    })
  });

  const updatedUser = { ...user, enrolledCourses: [...user.enrolledCourses, courseId] };
  setSession(updatedUser);
}

export async function completeLesson(lessonId: string, courseId: string, totalLessons: number, courseTitle: string) {
  const user = getSession();
  if (!user) return;
  if (user.completedLessons.includes(lessonId)) return;

  await fetch(`${API_URL}/progresso_aulas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `prog-${user.id}-${lessonId}`,
      ID_Usuario: user.id,
      ID_Aula: lessonId,
      DataConclusao: new Date().toISOString(),
      Status: 'Concluído'
    })
  });

  const newCompleted = [...user.completedLessons, lessonId];
  let updatedUser = { ...user, completedLessons: newCompleted };

  // Generate certificate if finished
  const completedInThisCourse = newCompleted.filter(id => id.startsWith(courseId)).length;
  if (completedInThisCourse === totalLessons && !updatedUser.certificates.some(c => c.courseId === courseId)) {
    const cert = {
      id: `cert-${Date.now()}`,
      courseId,
      courseTitle,
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    await fetch(`${API_URL}/certificados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: cert.id,
        ID_Usuario: user.id,
        ID_Curso: courseId,
        CodigoVerificacao: cert.verificationCode,
        DataEmissao: cert.issueDate
      })
    });

    updatedUser = { ...updatedUser, certificates: [...updatedUser.certificates, cert] };
  }

  setSession(updatedUser);
}

export async function getAllUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/usuarios`);
  const dbUsers = await res.json();
  
  const matriculasRes = await fetch(`${API_URL}/matriculas`);
  const dbMatriculas = await matriculasRes.json();
  
  const certRes = await fetch(`${API_URL}/certificados`);
  const dbCertificados = await certRes.json();
  
  return dbUsers.map((u: any) => ({
    id: u.id,
    name: u.NomeCompleto,
    email: u.Email,
    role: u.Role as 'student' | 'admin',
    enrolledCourses: dbMatriculas.filter((m: any) => m.ID_Usuario === u.id).map((m: any) => m.ID_Curso),
    completedLessons: [],
    certificates: dbCertificados.filter((c: any) => c.ID_Usuario === u.id).map((c: any) => ({
      id: c.id,
      courseId: c.ID_Curso,
      courseTitle: 'Curso',
      issueDate: c.DataEmissao,
      verificationCode: c.CodigoVerificacao
    })),
    needsPasswordReset: false
  }));
}

export async function issueCertificate(courseId: string, courseTitle: string) {
  const user = getSession();
  if (!user) return;
  if (user.certificates.some(c => c.courseId === courseId)) return;

  const cert = {
    id: `cert-${Date.now()}`,
    courseId,
    courseTitle,
    issueDate: new Date().toISOString().split('T')[0],
    verificationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
  };

  await fetch(`${API_URL}/certificados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: cert.id,
      ID_Usuario: user.id,
      ID_Curso: courseId,
      CodigoVerificacao: cert.verificationCode,
      DataEmissao: cert.issueDate
    })
  });

  const updatedUser = { ...user, certificates: [...user.certificates, cert] };
  setSession(updatedUser);
}
