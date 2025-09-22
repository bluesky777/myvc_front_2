import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { BACK_URL } from '../../../../../core/CONSTANTS_URL';
import { buildFileRequest } from '../../file-upload/utils/build-file-request';

@Injectable({
  providedIn: 'root',
})
export class ActaAcuerdoService {
  private uploadApiUrl = `${BACK_URL}/piars-actas-acuerdo/document`;

  constructor(private http: HttpClient) {}

  updateFile(
    file: File,
    alumnoId: number,
    documentField: string,
    yearId: number,
  ): Observable<any> {
    const req = buildFileRequest(file, alumnoId, documentField, this.uploadApiUrl, yearId);

    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: 'UploadStatus.UPLOADED',
          };
        } else if (res.type === HttpEventType.UploadProgress && res.total) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 * res.loaded) / res.total);
          return {
            status: 'UploadStatus.IN_PROGRESS',
            progress: uploadProgress,
          };
        } else {
          return res;
        }
      }),
      catchError((er) => {
        console.log(er);
        return of({ status: 'UploadStatus.ERROR', body: er });
      }),
    );
  }

  deleteFile(alumnoId: number, yearId: number): Observable<any> {
    return this.http.delete(`${this.uploadApiUrl}/${alumnoId}`, {
      body: JSON.stringify({ yearId }),
    });
  }
}
