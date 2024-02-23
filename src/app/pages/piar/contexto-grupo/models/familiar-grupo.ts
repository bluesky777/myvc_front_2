import { Student } from '../../../groups/models/student';

export interface GroupContext {
  id: number;
  grupo_id: number;
  titular_id: number;
  year_id: number;
  caracterizacion_grupo?: string;
  updated_at: string;
  updated_by: number;
}

export interface StudentPiar {
  id: number;
  alumno_id: number;
  year_id: number;
  contexto_sociofamiliar?: any;
  acta_de_acuerdo?: any;
  documento1?: any;
  documento2?: any;
  config?: any;
  created_at: string;
  updated_at: string;
  updated_by: number;
}

export interface GroupContextStudents {
  familiarContext: GroupContext[];
  alumnos: Student[];
  alumnos_piar: StudentPiar[];
}
