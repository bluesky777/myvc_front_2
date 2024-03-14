import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BACK_URL } from '../CONSTANTS_URL';
import { Year } from '../models/year';

@Injectable({
  providedIn: 'root',
})
export class YearsService {
  years: Year[] = [];

  _currentYear = new BehaviorSubject<Year>({} as Year);

  constructor(private httpService: HttpClient) {}

  getYears(): Observable<Year[]> {
    return this.httpService.get<Year[]>(`${BACK_URL}/years`).pipe(
      tap((years) => {
        this.years = years;
        const current = this.years.find((year) => year.actual === 1);
        if (current) {
          this._currentYear.next(current);
        }
      }),
    );
  }

  get currentYear() {
    return this._currentYear.asObservable();
  }
}
