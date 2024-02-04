export interface Group {
  id: number;
  nombre: string;
  abrev: string;
  orden: number;
  orden_grado: number;
  grado_id: number;
  year_id: number;
  titular_id: number;
  cupo: number;
  nombres_titular: string;
  apellidos_titular: string;
  titulo?: any;
  caritas: number;
  created_at: string;
  updated_at: string;
  nombre_grado: string;
}
