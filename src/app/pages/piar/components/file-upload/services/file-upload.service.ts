import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { BACK_URL } from '../../../../../core/CONSTANTS_URL';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private uploadApiUrl = `${BACK_URL}/piars-alumnos/document`;

  constructor(private http: HttpClient) {}

  updateFile(
    file: File,
    alumnoId: number,
    documentField: string,
  ): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    form.append('alumno_id', alumnoId.toString());
    form.append('documentField', documentField);

    const req = new HttpRequest('POST', this.uploadApiUrl, form, {
      reportProgress: true,
    });
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

  deleteFile(alumnoId: number, file_name: string): Observable<any> {
    return this.http.delete(`${this.uploadApiUrl}/${alumnoId}`, {
      body: JSON.stringify({ file_name }),
    });
  }
}
