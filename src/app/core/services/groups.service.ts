import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACK_URL } from '../CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private httpService: HttpClient) {}

  getGroups(): Observable<any> {
    return this.httpService.get(`${BACK_URL}/grupos`);
  }
}
