export interface Profile {
  persona_id: number;
  nombres: string;
  apellidos: string;
  user_id: number;
  username: string;
  is_superuser: number;
  tipo: string;
  sexo: Sexo;
  email: string;
  fecha_nac: string;
  ciudad_nac: string;
  profesor_id?: any;
  imagen_id?: number;
  imagen_nombre: string;
  foto_id?: number;
  foto_nombre: string;
  grupo_id: string;
  nombre_grupo: string;
  abrev_grupo: string;
  year_matricula_id: string;
  periodo_id: number;
  numero_periodo: number;
  profes_pueden_editar_notas: number;
  profes_pueden_nivelar: number;
  year_id: number;
  year: number;
  nota_minima_aceptada: string;
  year_actual: number;
  periodo_actual: number;
  unidad_displayname: string;
  subunidad_displayname: string;
  unidades_displayname: string;
  subunidades_displayname: string;
  show_materias_todas: number;
  genero_unidad: string;
  genero_subunidad: string;
  fecha_plazo?: any;
  si_recupera_materia_recup_indicador: number;
  year_pasado_en_bol: number;
  mostrar_nota_comport_boletin: number;
  alumnos_can_see_notas: number;
  logo_id: number;
  puestos_alfabeticamente: number;
  roles: Role[];
  perms: any[];
  token: any[];
}

export type Sexo = 'F' | 'M';

interface Role {
  id: number;
  name: string;
  created_by?: any;
  updated_by?: any;
  deleted_by?: any;
  display_name?: any;
  description?: any;
  deleted_at?: any;
  created_at: string;
  updated_at: string;
}
