import { Component, Input, OnInit } from '@angular/core';
import { DocumentToLoad, FileUploadComponent, UploadedDocument } from '../file-upload/file-upload.component';
import { ActaAcuerdo, Matricula } from '../../../groups/models/acta-acuerdo';
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
export class ActasDeAcuerdoComponent implements OnInit {
  @Input() matriculas!: Matricula[];

  @Input() alumnoId!: number;

  @Input() titular_id!: number;

  /** `year_id` del acta que se está subiendo, o null si no hay ninguna. */
  savingYearId: number | null = null;

  actas: Matricula[] = [];

  constructor(
    private toastr: ToastrService,
    private actaAcuerdoService: ActaAcuerdoService,
    public profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    // El backend puede no enviar `matriculas`, o enviar una matrícula sin
    // `acta`; se normaliza aquí para que la plantilla no tenga que defenderse.
    this.actas = (this.matriculas ?? []).map((matricula) => ({
      ...matricula,
      acta: matricula.acta ?? ({} as ActaAcuerdo),
      showDocument: !!matricula.acta?.documento,
    }));
  }

  toggleDocument($event: any, acta: any) {
    $event.preventDefault();
    acta.showDocument = !acta.showDocument;
  }

  handleUpdatedFile(matricula: Matricula, $event: UploadedDocument) {
    matricula.acta.documento = $event.fileName;
  }

  handleUpload({ file, alumnoId, documentField }: DocumentToLoad, matricula: Matricula) {
    if (this.savingYearId !== null) return;

    this.savingYearId = matricula.year_id;

    this.actaAcuerdoService
      .updateFile(file, alumnoId, documentField, matricula.year_id)
      .subscribe({
        next: (res) => {
          if (res.status === 'UploadStatus.UPLOADED') {
            this.savingYearId = null;
            // Sin esto la vista sigue mostrando el dropzone en vez del enlace
            // hasta recargar: la subida delegada no emite `updatedFile`.
            //
            // El nombre real lo decide el backend —guarda en
            // `user_<user_id>/<nombre>` y resuelve colisiones con `(1)`,
            // `(2)`…, y la carpeta es por usuario, no por alumno—, así que no
            // se puede deducir aquí: viene en `documento`.
            matricula.acta.documento = res.body?.documento ?? file.name;
            matricula.showDocument = true;
            this.toastr.success('Acta guardada.');
          }
          if (res.status === 'UploadStatus.ERROR') {
            this.savingYearId = null;
            this.toastr.warning('Error guardando archivo');
          }
        },
        error: () => {
          this.savingYearId = null;
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
