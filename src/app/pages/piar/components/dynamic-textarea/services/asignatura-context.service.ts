import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACK_URL } from '../../../../../core/CONSTANTS_URL';
import { DynamicTextareaObject } from '../models/dynamic-textarea-object';

@Injectable({
  providedIn: 'root',
})
export class AsignaturaContextService {
  constructor(private http: HttpClient) {}

  updateField(dynamicObject: DynamicTextareaObject): Observable<any> {
    return this.http.put(`${BACK_URL}/piars-asignaturas/field`, dynamicObject);
  }
}
