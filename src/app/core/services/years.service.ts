import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class YearsService {
  constructor(private httpService: HttpClient) {}

  getYears(): Observable<any> {
    return this.httpService.get(`${BASE_URL}/years`);
  }
}
