import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { BACK_URL, GENDER_URL, IMAGES_URL } from '../CONSTANTS_URL';
import { Profile } from '../models/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  user?: Profile;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http
      .post<Profile>(`${BACK_URL}/login`, {})
      .pipe(tap((user: Profile) => (this.user = user)));
  }

  getImage(foto_nombre: string, sexo: 'M' | 'F'): string {
    return foto_nombre ? `${IMAGES_URL}/${foto_nombre}` : GENDER_URL[sexo];
  }

  isTitular(titular_id: number): boolean {
    return (
      this.user?.tipo === 'Profesor' && this.user?.persona_id === titular_id
    );
  }
}
