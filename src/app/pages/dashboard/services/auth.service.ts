import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../../../core/constants-urls';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpClient) {}

  getYears(): Observable<any> {
    return this.httpService.get(`${BASE_URL}/years`);
  }
}
