import { User } from '../types';

const API_URL = 'http://localhost:3000';
const SESSION_KEY = 'saddi_session';

export function getSession(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(usuario: User) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
  window.dispatchEvent(new Event('session_change'));
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('session_change'));
}

export async function login(email: string, password?: string): Promise<{ ok: boolean; usuario?: User; message?: string }> {
  try {
    const passQuery = password ? `&SenhaHash=${encodeURIComponent(password)}` : '';
    const res = await fetch(`${API_URL}/usuarios?Email=${encodeURIComponent(email)}${passQuery}`);
    const usuarios = await res.json();
    
    if (usuarios.length === 0) {
      return { ok: false, message: 'E-mail ou senha incorretos.' };
    }
    
    const dbUser = usuarios[0];
    
    // Buscar dependências para montar o objeto User que o frontend espera
    const [matriculasRes, progressoRes, certRes] = await Promise.all([
      fetch(`${API_URL}/matriculas?ID_Usuario=${dbUser.id}`),
      fetch(`${API_URL}/progresso_aulas?ID_Usuario=${dbUser.id}&Status=Concluído`),
      fetch(`${API_URL}/certificados?ID_Usuario=${dbUser.id}`)
    ]);

    const dbMatriculas = await matriculasRes.json();
    const dbProgresso = await progressoRes.json();
    const dbCertificados = await certRes.json();

    const usuario: User = {
      id: dbUser.id,
      name: dbUser.NomeCompleto,
      email: dbUser.Email,
      role: dbUser.Role as 'student' | 'admin',
      enrolledCourses: dbMatriculas.map((m: any) => m.ID_Curso),
      completedLessons: dbProgresso.map((p: any) => p.ID_Aula),
      certificates: dbCertificados.map((c: any) => ({
        id: c.id,
        courseId: c.ID_Curso,
        courseTitle: 'Curso',
        issueDate: c.DataEmissao,
        verificationCode: c.CodigoVerificacao
      })),
      needsPasswordReset: dbUser.SenhaHash === '12345',
      passwordHash: dbUser.SenhaHash
    };

    setSession(usuario);
    return { ok: true, usuario };
  } catch (e) {
    return { ok: false, message: 'Erro ao conectar com o servidor.' };
  }
}

export async function register(name: string, email: string, passwordHash: string, role: 'student' | 'admin'): Promise<{ ok: boolean; usuario?: User; message?: string }> {
  try {
    const resVerifica = await fetch(`${API_URL}/usuarios?Email=${encodeURIComponent(email)}`);
    const usuarios = await resVerifica.json();
    if (usuarios.length > 0) {
      return { ok: false, message: 'E-mail já cadastrado.' };
    }
    
    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId,
      NomeCompleto: name,
      Email: email,
      SenhaHash: passwordHash || '123456',
      DataCadastro: new Date().toISOString(),
      Role: role
    };
    
    await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    
    const usuario: User = {
      id: newId,
      name,
      email,
      role,
      enrolledCourses: [],
      completedLessons: [],
      certificates: [],
      needsPasswordReset: false,
      passwordHash
    };
    
    setSession(usuario);
    return { ok: true, usuario };
  } catch (e) {
    return { ok: false, message: 'Erro ao cadastrar no servidor.' };
  }
}

export async function updatePassword(newPassword: string): Promise<boolean> {
  const user = getSession();
  if (!user) return false;
  
  try {
    const res = await fetch(`${API_URL}/usuarios/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ SenhaHash: newPassword })
    });
    if (res.ok) {
      const updatedUser = { ...user, needsPasswordReset: false, passwordHash: newPassword };
      setSession(updatedUser);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}
