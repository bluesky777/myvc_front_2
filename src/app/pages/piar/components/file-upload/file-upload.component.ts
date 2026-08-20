import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropzoneCdkModule, FileInputValidators } from '@ngx-dropzone/cdk';
import { DropzoneMaterialModule } from '@ngx-dropzone/material';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { UPLOADS_URL } from '../../../../core/CONSTANTS_URL';
import { ProfileService } from '../../../../core/services/profile.service';
import { FileUploadService } from './services/file-upload.service';
import { HistoryModalComponent } from './history-modal/history-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ActaAcuerdoService } from '../actas-de-acuerdo/services/acta-acuerdo.service';

export type UploadedDocument = {
  documentField: string;
  fileName: string;
};

export type DocumentToLoad = {
  documentField: string;
  file: File;
  alumnoId: number;
};

export const MAX_FILE_SIZE = 5000000; // 5MB

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

  @Input() yearId?: number;

  /**
   * Permite que el padre muestre el spinner cuando es él quien realiza la
   * subida (ver `handleUpload`), porque en ese caso `savingFile` no se usa.
   */
  @Input() saving = false;

  @Output() updatedFile = new EventEmitter<UploadedDocument>();

  @Output() handleUpload = new EventEmitter<DocumentToLoad>();

  validators = [
    FileInputValidators.accept('application/pdf'),
    FileInputValidators.accept(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ),
  ];

  myForm: FormGroup;

  UPLOADS_URL = UPLOADS_URL;

  savingFile = false;

  deletingFile = false;

  constructor(
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    public profileService: ProfileService,
    public dialog: MatDialog,
    private actaAcuerdoService: ActaAcuerdoService,
  ) {
    this.myForm = this.fb.group({
      fileCtrl: [
        null,
        [Validators.required, this.fileTypeValidator(['pdf', 'doc', 'docx'])],
      ],
    });
  }

  /**
   * Getter (y no un campo calculado en `ngOnInit`) para que el nombre siga al
   * `documentName` cuando el padre lo actualiza tras subir o borrar.
   */
  get documentNameAlone(): string {
    if (!this.documentName) {
      return '';
    }
    return this.documentName.indexOf('/') > -1
      ? this.documentName.split('/')[1] || ''
      : this.documentName;
  }

  clear() {
    this.fileControl.setValue(null);
  }

  uploadFile() {
    if (!this.fileControl.value) return;

    const file = this.fileControl.value as File;

    // Se valida antes de levantar cualquier flag de carga, y aquí y no en
    // `defaultHandleUpload` para cubrir también la subida delegada al padre.
    if (file.size > MAX_FILE_SIZE) {
      this.toastr.error('El archivo supera el tamaño máximo de 5MB.');
      return;
    }

    const data = {
      documentField: this.documentField,
      file,
      alumnoId: this.alumnoId,
    } as DocumentToLoad

    if (this.handleUpload.observed) {
      this.handleUpload.emit(data);
      return;
    }

    if (this.savingFile) return;

    this.savingFile = true;

    this.defaultHandleUpload(data)

  }

  defaultHandleUpload({ file }: DocumentToLoad) {
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
          if (res.status === 'UploadStatus.ERROR') {
            this.savingFile = false;
            this.toastr.warning('Error guardando archivo');
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

    let uploadObservable;

    if (this.yearId && this.documentField === 'actaAcuerdo') {
      uploadObservable = this.actaAcuerdoService.deleteFile(this.alumnoId, this.yearId);
    } else {
      uploadObservable = this.fileUploadService.deleteFile(this.alumnoId, this.documentField as string);
    }

    uploadObservable
      .subscribe({
        next: () => {
          this.documentName = undefined;
          this.toastr.success('Archivo eliminado.');
          // El padre es dueño del modelo: sin esto se queda con el nombre del
          // archivo ya borrado y lo reaparece al recrearse el componente.
          this.updatedFile.emit({
            documentField: this.documentField,
            fileName: '',
          } as UploadedDocument);
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

    if (this.documentField === 'documento2' || this.documentField === 'actaAcuerdo') {
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
