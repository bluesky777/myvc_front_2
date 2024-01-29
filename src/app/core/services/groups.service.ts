import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants-urls';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private httpService: HttpClient) {}

  getGroups(): Observable<any> {
    const token = localStorage.getItem('xtoken');
    return this.httpService.get(`${BASE_URL}/grupos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
