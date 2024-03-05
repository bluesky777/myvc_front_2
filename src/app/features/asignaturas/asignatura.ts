export interface Asignatura {
  asignatura_id: number;
  grupo_id: number;
  profesor_id: number;
  creditos: number;
  orden: number;
  materia: string;
  alias_materia: string;
  nombre_grupo: string;
  abrev_grupo: string;
  titular_id: number;
  caritas: number;
  nivel_educativo_id: number;
  piar_asignatura: PiarAsignatura;
}
interface PiarAsignatura {
  id: number;
  asignatura_id: number;
  alumno_id: number;
  year: number;
  apoyo_razonable?: any;
  seguimientos?: any;
  created_at: string;
  updated_at: string;
  updated_by: number;
}
