import { Student } from '../../../../groups/models/student';

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
  valoracion_pedagogica?: string;
  ajustes_generales?: string;
  acta_de_acuerdo?: string;
  documento1?: string;
  documento2?: string;
  history?: any;
  created_at: string;
  updated_at: string;
  updated_by: number;
  acudientes: Acudiente[];
}

export interface GroupContextStudents {
  familiarContext: GroupContext[];
  alumnos: Student[];
  alumnos_piar: StudentPiar[];
}

interface Acudiente {
  id: number;
  nombres: string;
  apellidos: string;
  direccion?: any;
  sexo: string;
  email?: any;
  celular: string;
  parentesco: string;
  telefono?: any;
}
