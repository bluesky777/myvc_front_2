import { StudentPiar } from '../../piar/contexto-grupo/models/familiar-grupo';

export interface Student {
  id: number;
  nombres: string;
  apellidos: string;
  sexo: string;
  estado: string;
  foto_id: number;
  foto_nombre: string;
  expanded?: boolean;
  index?: number;
  studentPiar?: StudentPiar;
}
