import { Component, Input } from '@angular/core';
import { FileUploadComponent, UploadedDocument } from '../file-upload/file-upload.component';
import { Matricula } from '../../../groups/models/acta-acuerdo';

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

  showDocument = false;

  isChangingFile = false;

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
}
