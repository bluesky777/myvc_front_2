import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropzoneCdkModule, FileInputValidators } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { Validators } from 'ngx-editor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { UPLOADS_URL } from '../../../../core/CONSTANTS_URL';
import { ProfileService } from '../../../../core/services/profile.service';
import { FileUploadService } from './services/file-upload.service';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { MatDialog } from '@angular/material/dialog';

export type UploadedDocument = {
  documentField: string;
  fileName: string;
};

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() alumnoId!: number;

  @Input() documentName?: string;

  @Input() history!: any;

  @Input() documentField = 'documento1';

  @Input() titular_id!: number;

  @Output() updatedFile = new EventEmitter<UploadedDocument>();

  validators = [
    FileInputValidators.accept('application/pdf'),
    FileInputValidators.accept(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ),
  ];

  myForm: FormGroup;

  UPLOADS_URL = UPLOADS_URL;

  documentNameAlone = '';

  savingFile = false;

  deletingFile = false;

  constructor(
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    public profileService: ProfileService,
    public dialog: MatDialog,
  ) {
    this.myForm = this.fb.group({
      fileCtrl: [
        null,
        [Validators.required, this.fileTypeValidator(['pdf', 'doc', 'docx'])],
      ],
    });
  }

  ngOnInit(): void {
    if (this.documentName && this.documentName.indexOf('/') > -1) {
      this.documentNameAlone = this.documentName?.split('/')[1] || '';
    } else {
      this.documentNameAlone = this.documentName as string;
    }
  }

  clear() {
    this.fileControl.setValue(null);
  }

  uploadFile() {
    if (this.savingFile) return;

    this.savingFile = true;

    if (!this.fileControl.value) return;

    const file = this.fileControl.value as File;

    const MAX_SIZE = 5000000; // 5MB
    if (file && file.size > MAX_SIZE) {
      this.toastr.success('Tamaño invalido');
      return;
    }

    this.fileUploadService
      .updateFile(file, this.alumnoId, this.documentField)
      .subscribe({
        next: (res) => {
          if (res.status === 'UploadStatus.UPLOADED') {
            this.savingFile = false;
            this.toastr.success('Archivo guardado');
            this.updatedFile.emit({
              documentField: this.documentField,
              fileName: file.name,
            } as UploadedDocument);
          }
        },
        error: () => {
          this.savingFile = false;
          this.toastr.warning('Error guardando archivo');
        },
      });
  }

  public removeFile(): void {
    this.deletingFile = true;

    this.fileUploadService
      .deleteFile(this.alumnoId, this.documentField)
      .subscribe({
        next: () => {
          this.documentName = undefined;
          this.toastr.success('Archivo eliminado.');
          this.cancelFile();
          this.savingFile = false;
          this.deletingFile = false;
        },
        error: () => {
          this.toastr.error('Lo sentimos, no se pudo subir el archivo.');
          this.deletingFile = false;
          this.savingFile = false;
        },
      });
  }

  public cancelFile(): void {
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

  hasEditingPermissions(): boolean {
    const isAdmin = !!(this.profileService.user?.tipo === 'Usuario');

    if (this.documentField === 'documento2') {
      const isTitular = !!(
        this.profileService.user?.tipo === 'Profesor' &&
        this.titular_id === this.profileService.user?.persona_id);
      

      return isTitular || isAdmin;
    } else {
      return isAdmin;
    }
  }

  openDialogHistory(): void {
    const dialogRef = this.dialog.open(HistoryModalComponent, {
      data: this.history,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  get fileControl(): FormControl {
    return this.myForm.get('fileCtrl') as FormControl;
  }

  get file(): File {
    return (this.myForm.get('fileCtrl') as FormControl).value as File;
  }
}
