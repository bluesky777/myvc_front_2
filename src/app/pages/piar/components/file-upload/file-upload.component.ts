import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BACK_URL } from '../../../../core/CONSTANTS_URL';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DropzoneCdkModule,
  FileInputValidators,
  FileInputValue,
} from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, catchError, map, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatButton,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    ToastrModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() alumnoId!: number;

  validators = [
    FileInputValidators.accept('application/pdf'),
    FileInputValidators.accept(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ),
  ];

  fileCtrl = new FormControl<File | null>(null, this.validators);

  uploadApiUrl = `${BACK_URL}/piars-alumnos/document`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.fileCtrl.valueChanges.subscribe({
      next: (res) => console.log(res),
    });
  }

  clear() {
    this.fileCtrl.setValue(null);
  }

  uploadFile() {
    const MAX_SIZE = 5000000; // 5MB
    if (this.fileCtrl.value && this.fileCtrl.value.size > MAX_SIZE) {
      this.toastr.success('Tamaño invalido');
    }

    const form = new FormData();
    form.append('file', this.fileCtrl.value as File);
    form.append('alumno_id', this.alumnoId.toString());

    const req = new HttpRequest('POST', this.uploadApiUrl, form, {
      reportProgress: true,
    });

    this.http
      .request(req)
      .pipe(
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
            return undefined;
          }
        }),
        catchError((er) => {
          console.log(er);
          return of({ status: 'UploadStatus.ERROR', body: er });
        }),
      )
      .subscribe({
        next: () => {
          console.log('Subs');
        },
      });
  }

  public removeFile(fileItem: any): Observable<any> {
    const id = 50;
    const responseFromBackend = fileItem.uploadResponse;
    console.log(fileItem);
    const removeApi =
      'https://run.mocky.io/v3/dedf88ec-7ce8-429a-829b-bd2fc55352bc';
    return this.http.post(removeApi, { id });
  }
}
