import { Component, Input } from '@angular/core';
import { DocumentToLoad, FileUploadComponent, UploadedDocument } from '../file-upload/file-upload.component';
import { Matricula } from '../../../groups/models/acta-acuerdo';
import { ToastrService } from 'ngx-toastr';
import { ActaAcuerdoService } from './services/acta-acuerdo.service';
import { ProfileService } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-acta-de-acuerdo',
  standalone: true,
  imports: [
    FileUploadComponent,
  ],
  templateUrl: './actas-de-acuerdo.component.html',
  styleUrl: './actas-de-acuerdo.component.scss'
})
export class ActasDeAcuerdoComponent {
  @Input() matriculas!: Matricula[];

  @Input() alumnoId!: number;

  @Input() titular_id!: number;

  showDocument = false;

  isChangingFile = false;

  savingFile = false;

  deletingFile = false;

  constructor(
    private toastr: ToastrService,
    private actaAcuerdoService: ActaAcuerdoService,
    public profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.setShowDocument(false);
  }

  setShowDocument(value: boolean) {
    this.matriculas.forEach((matricula) => {
      matricula.showDocument = !!matricula.acta.documento;
    });
  }

  toggleDocument($event: any, acta: any) {
    $event.preventDefault();
    acta.showDocument = !acta.showDocument;
  }

  handleUpdatedFile(matricula: Matricula, $event: UploadedDocument) {
    this.isChangingFile = true;
    if ($event.documentField === 'documento1') {
      matricula.acta.documento = $event.fileName;
    } else {
      matricula.acta.documento = $event.fileName;
    }
    setTimeout(() => (this.isChangingFile = false), 200);
  }

  handleUpload({ file, alumnoId, documentField }: DocumentToLoad, matricula: Matricula) {
    if (this.savingFile) return;

    this.savingFile = true;

    const MAX_SIZE = 5000000; // 5MB
    if (file && file.size > MAX_SIZE) {
      this.toastr.success('Tamaño invalido');
      return;
    }

    this.actaAcuerdoService
      .updateFile(file, alumnoId, documentField, matricula.year_id)
      .subscribe({
        next: (res) => {
          if (res.status === 'UploadStatus.UPLOADED') {
            this.savingFile = false;
            this.toastr.success('Acta guardada.');
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

  hasEditingPermissions(): boolean {
    const isAdmin = !!(this.profileService.user?.tipo === 'Usuario');

    const isTitular = !!(
      this.profileService.user?.tipo === 'Profesor' &&
      this.titular_id === this.profileService.user?.persona_id);
    
    return isTitular || isAdmin;
  }
}
