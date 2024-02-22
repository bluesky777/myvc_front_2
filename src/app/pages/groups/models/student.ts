import { StudentPiar } from '../../piar/contexto-familiar/models/familiar-context';

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
