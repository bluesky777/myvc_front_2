import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACK_URL } from '../CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private httpService: HttpClient) {}

  getStudents(group_id: string): Observable<any> {
    return this.httpService.get(
      `${BACK_URL}/piars-grupos/contexto-de-grupo/${group_id}`,
    );
  }
}
