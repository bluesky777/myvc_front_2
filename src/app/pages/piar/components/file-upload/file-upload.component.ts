import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {
  MatButton,
  MatButtonModule,
  MatFabButton,
  MatIconButton,
} from '@angular/material/button';
import { UPLOADS_URL } from '../../../../core/CONSTANTS_URL';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DropzoneCdkModule,
  FileInputValidators,
  FileInputValue,
} from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { MatIconModule } from '@angular/material/icon';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { Observable, catchError, map, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FileUploadService } from './services/file-upload.service';
import { Validators } from 'ngx-editor';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    DropzoneCdkModule,
    DropzoneMaterialModule,
    MatButtonModule,
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
  @Input() documentName?: string;

  validators = [
    FileInputValidators.accept('application/pdf'),
    FileInputValidators.accept(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ),
  ];

  myForm: FormGroup;

  // fileCtrl = new FormControl<File | null | File[]>(null, [
  //   Validators.required,
  //   this.fileTypeValidator(['pdf', 'doc', 'docx']),
  // ]);

  UPLOADS_URL = UPLOADS_URL;

  documentNameAlone = '';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
  ) {
    this.myForm = this.fb.group({
      fileCtrl: [
        null,
        [Validators.required, this.fileTypeValidator(['pdf', 'doc', 'docx'])],
      ],
    });
  }

  ngOnInit(): void {
    this.documentNameAlone = this.documentName?.split('/')[1] || '';
  }

  clear() {
    this.fileControl.setValue(null);
  }

  uploadFile() {
    if (!this.fileControl.value) return;

    const file = this.fileControl.value as File;

    const MAX_SIZE = 5000000; // 5MB
    if (file && file.size > MAX_SIZE) {
      this.toastr.success('Tamaño invalido');
    }

    this.fileUploadService.updateFile(file, this.alumnoId).subscribe({
      next: (res) => {
        console.log('Subs', res);
      },
    });
  }

  public removeFile(): void {
    this.fileControl.setValue(null);
  }

  fileTypeValidator(allowedTypes: string[]) {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        const fileName = file.name.toLowerCase();
        const extension = fileName.split('.').pop();
        if (!allowedTypes.includes(extension)) {
          return { invalidFileType: true };
        }
      }
      return null;
    };
  }

  get fileControl(): FormControl {
    return this.myForm.get('fileCtrl') as FormControl;
  }

  get file(): File {
    return (this.myForm.get('fileCtrl') as FormControl).value as File;
  }
}
