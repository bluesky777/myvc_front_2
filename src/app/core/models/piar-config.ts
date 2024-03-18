import { Periodo } from './year';

export interface PiarConfigRespose {
  piarsConfig: PiarConfig;
  year: YearReport;
}

export interface PiarConfig {
  id: number;
  reporte_default?: any;
  config?: string;
  updated_at: string;
  updated_by: number;
}

export interface YearReport {
  year_id: number;
  year: number;
  nombre_colegio: string;
  abrev_colegio: string;
  ciudad_id: string;
  ciudad: string;
  departamento: string;
  resolucion: string;
  codigo_dane: string;
  mostrar_puesto_boletin: number;
  puestos_alfabeticamente: number;
  show_fortaleza_bol: number;
  mostrar_nota_comport_boletin: number;
  logo_id: number;
  logo: string;
  img_encabezado_id?: number;
  img_encabezado?: number;
  nota_minima_aceptada: string;
  minu_hora_clase: number;
  encabezado_certificado: string;
  config_certificado_estudio_id: number;
  si_recupera_materia_recup_indicador: number;
  cant_areas_pierde_year: number;
  cant_asignatura_pierde_year: number;
  caracter: string;
  calendario: string;
  jornada: string;
  contador_certificados: string;
  frase_final_certificado?: string;
  contador_folios: string;
  texto_acta_eval?: string;
  show_subasignaturas_en_finales: number;
  mensaje_aprobo_con_pendientes: number;
  msg_when_students_blocked: string;
  titulo_rector: string;
  secretario_id: number;
  nombres_secretario: string;
  apellidos_secretario: string;
  sexo_secretario: string;
  secretario_documento?: string;
  secre_foto_id?: number;
  secre_foto_nombre: string;
  secre_firma_id: number;
  secre_firma: string;
  rector_id: number;
  nombres_rector: string;
  apellidos_rector: string;
  sexo_rector: string;
  rector_documento?: string;
  rector_foto_id?: number;
  rector_foto_nombre: string;
  rector_firma_id: number;
  rector_firma: string;
  periodos: Periodo[];
}
