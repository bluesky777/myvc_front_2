import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Student } from '../../../../groups/models/student';
import { Group } from '../../../../groups/models/groups';

export type StudentAndGroup = { alumno: Student; grupo: Group };

@Injectable({
  providedIn: 'root',
})
export class InformePedagogicoService {
  _studentAndGroup = new Subject<StudentAndGroup>();

  constructor(private http: HttpClient) {}

  // saveText() {
  //   return this.http.put(`${BACK_URL}/piars-config/field`);
  // }

  setStudentAndGroup(studentAndGroup: StudentAndGroup) {
    this._studentAndGroup.next(studentAndGroup);
  }

  get studentAndGroup$(): Observable<StudentAndGroup> {
    return this._studentAndGroup.asObservable();
  }
}
