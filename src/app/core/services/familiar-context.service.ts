import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FamiliarContext,
  FamiliarContextStudents,
} from '../../pages/piar/contexto-familiar/models/familiar-context';
import { BACK_URL } from '../CONSTANTS_URL';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class FamiliarContextService {
  constructor(private httpService: HttpClient) {}

  getFamiliarContext(group_id: string) {
    return this.httpService.get<ApiResponse<FamiliarContextStudents>>(
      `${BACK_URL}/piars-grupos/contexto-de-grupo/${group_id}`,
    );
  }

  saveFamiliarContext(familiarContext: FamiliarContext) {
    return this.httpService.put<ApiResponse<FamiliarContext>>(
      `${BACK_URL}/piars-grupos/contexto-de-grupo`,
      familiarContext,
    );
  }
}
