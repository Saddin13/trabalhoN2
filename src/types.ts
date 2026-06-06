// === Tipos da UI (Mantidos para compatibilidade com os componentes existentes) ===
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
  category: string;
  description: string;
  longDescription: string;
  rating: number;
  studentsCount: number;
  modulesCount: number;
  duration: string;
  level: string;
  image: string;
  instructorName: string;
  instructorRole: string;
  instructorBio: string;
  modules: Module[];
}

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrolledCourses: string[]; // array de course.id
  completedLessons: string[]; // array de lesson.id
  certificates: Certificate[];
  needsPasswordReset?: boolean;
  passwordHash?: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  verificationCode?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  coursesIds: string[]; // Ordem dos cursos na trilha
}

// === Tipos do PDF (Entidades do JSON Server) ===

export interface DBUsuario {
  id: string; // PK
  NomeCompleto: string;
  Email: string;
  SenhaHash: string;
  DataCadastro: string;
  Role: string;
}

export interface DBCategoria {
  id: string; // PK
  Nome: string;
  Descricao: string;
}

export interface DBCurso {
  id: string; // PK
  Titulo: string;
  Descricao: string;
  ID_Instrutor: string;
  ID_Categoria: string;
  Nivel: string;
  DataPublicacao: string;
  TotalAulas: number;
  TotalHoras: string;
  Imagem?: string;
}

export interface DBModulo {
  id: string; // PK
  ID_Curso: string;
  Titulo: string;
  Ordem: number;
}

export interface DBAula {
  id: string; // PK
  ID_Modulo: string;
  Titulo: string;
  TipoConteudo: string;
  URL_Conteudo: string;
  DuracaoMinutos: number;
  Ordem: number;
}

export interface DBMatricula {
  id: string; // PK
  ID_Usuario: string;
  ID_Curso: string;
  DataMatricula: string;
  DataConclusao?: string;
}

export interface DBProgressoAula {
  id: string; // ID_Usuario + ID_Aula
  ID_Usuario: string;
  ID_Aula: string;
  DataConclusao: string;
  Status: string;
}

export interface DBAvaliacao {
  id: string; // PK
  ID_Usuario: string;
  ID_Curso: string;
  Nota: number;
  Comentario?: string;
  DataAvaliacao: string;
}

export interface DBTrilha {
  id: string; // PK
  Titulo: string;
  Descricao: string;
  ID_Categoria: string;
}

export interface DBTrilhaCurso {
  id: string; // Associativa
  ID_Trilha: string;
  ID_Curso: string;
  Ordem: number;
}

export interface DBCertificado {
  id: string; // PK
  ID_Usuario: string;
  ID_Curso: string;
  ID_Trilha?: string;
  CodigoVerificacao: string;
  DataEmissao: string;
}

export interface DBPlano {
  id: string; // PK
  Nome: string;
  Descricao: string;
  Preco: number;
  DuracaoMeses: number;
}

export interface DBAssinatura {
  id: string; // PK
  ID_Usuario: string;
  ID_Plano: string;
  DataInicio: string;
  DataFim: string;
}

export interface DBPagamento {
  id: string; // PK
  ID_Assinatura: string;
  ValorPago: number;
  DataPagamento: string;
  MetodoPagamento: string;
  Id_Transacao_Gateway: string;
}
