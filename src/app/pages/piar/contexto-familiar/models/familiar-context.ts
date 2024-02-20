import { Student } from '../../../groups/models/student';

export interface FamiliarContext {
  id: number;
  grupo_id: number;
  titular_id: number;
  year_id: number;
  caracterizacion_grupo?: string;
  updated_at: string;
  updated_by: number;
}

export interface FamiliarContextStudents {
  familiarContext: FamiliarContext[];
  alumnos: Student[];
}
