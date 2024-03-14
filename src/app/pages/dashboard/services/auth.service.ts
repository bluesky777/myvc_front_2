import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACK_URL } from '../../../core/CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpClient) {}
}
