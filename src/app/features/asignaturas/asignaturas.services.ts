import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACK_URL } from '../../core/CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class AsignaturasService {
  constructor(private http: HttpClient) {}

  getAsignaturas(grupo_id: number, alumno_id: number): Observable<any> {
    return this.http.get(
      `${BACK_URL}/piars-asignaturas/asignaturas/${grupo_id}/${alumno_id}`,
    );
  }
}
