import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BACK_URL } from '../CONSTANTS_URL';
import { Year } from '../models/year';
import { PiarConfigRespose } from '../models/piar-config';

@Injectable({
  providedIn: 'root',
})
export class YearsService {
  years: Year[] = [];

  _piarConfig = new BehaviorSubject<PiarConfigRespose>({} as PiarConfigRespose);

  _currentYear = new BehaviorSubject<Year>({} as Year);

  constructor(private http: HttpClient) {}

  getYears(): Observable<Year[]> {
    return this.http.get<Year[]>(`${BACK_URL}/years`).pipe(
      tap((years) => {
        this.years = years;
        const current = this.years.find((year) => year.actual === 1);
        if (current) {
          this._currentYear.next(current);
        }
      }),
    );
  }

  getPiarConfig(): Observable<PiarConfigRespose> {
    return this.http.get<PiarConfigRespose>(`${BACK_URL}/piars-config`).pipe(
      tap((config) => {
        this._piarConfig.next(config);
      }),
    );
  }

  get currentYear() {
    return this._currentYear.asObservable();
  }

  get piarConfig(): Observable<PiarConfigRespose> {
    return this._piarConfig.asObservable();
  }
}
