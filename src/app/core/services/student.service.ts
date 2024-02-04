import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private httpService: HttpClient) {}

  getStudents(group_id: string): Observable<any> {
    return this.httpService.get(`${BASE_URL}/alumnos/${group_id}`);
  }
}
