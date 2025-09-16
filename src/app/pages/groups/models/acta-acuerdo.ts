export interface Matricula {
  matricula_id: number;
  grupo_id: number;
  estado: string;
  abrev: string;
  nombre: string;
  titular_id: number;
  year: number;
  year_id: number;
  acta: ActaAcuerdo;
  showDocument: boolean;
}

export interface ActaAcuerdo {
  acta_id: number;
  documento: string;
  history: string;
}