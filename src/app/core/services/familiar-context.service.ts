import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GroupContext,
  GroupContextStudents,
} from '../../pages/piar/components/contexto-grupo/models/familiar-grupo';
import { BACK_URL } from '../CONSTANTS_URL';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class FamiliarContextService {
  constructor(private httpService: HttpClient) {}

  getFamiliarContext(group_id: string) {
    return this.httpService.get<ApiResponse<GroupContextStudents>>(
      `${BACK_URL}/piars-grupos/contexto-de-grupo/${group_id}`,
    );
  }

  saveGroupContext(familiarContext: GroupContext) {
    return this.httpService.put<ApiResponse<GroupContext>>(
      `${BACK_URL}/piars-grupos/contexto-de-grupo`,
      familiarContext,
    );
  }
}
