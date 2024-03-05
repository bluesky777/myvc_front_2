import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Asignatura } from '../../../../features/asignaturas/asignatura';
import { Student } from '../../../groups/models/student';
import { ApoyoAjustesComponent } from '../apoyo-ajustes/apoyo-ajustes.component';
import { DynamicTextareaComponent } from '../dynamic-textarea/dynamic-textarea.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { PerfilContainerComponent } from '../perfil-container/perfil-container.component';
import { AsignaturasService } from './../../../../features/asignaturas/asignaturas.services';

@UntilDestroy()
@Component({
  selector: 'app-table-piar',
  standalone: true,
  imports: [
    DynamicTextareaComponent,
    FileUploadComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    PerfilContainerComponent,
    ApoyoAjustesComponent,
  ],
  templateUrl: './table-piar.component.html',
  styleUrl: './table-piar.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class TablePiarComponent implements OnInit, OnChanges {
  @Input() alumnos!: Student[];

  @Input() titular_id!: number;

  filteredAlumnos: Student[] = [];

  columnsToDisplay = ['Nro', 'Apellidos', 'Nombres', 'Sexo'];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'ERE', 'expand'];

  filterPredicate = 'showOnlyNEE'; // 'showAll'

  constructor(
    private toastr: ToastrService,
    private asignaturasService: AsignaturasService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const alumnos = changes['alumnos']?.currentValue as Student[];
    if (alumnos) {
      this.alumnos = alumnos
        .filter((alum) => alum.studentPiar?.id)
        .map((alumno, index) => ({
          ...alumno,
          nro: index + 1,
        }));
    }
  }

  onRowClick({
    element,
    $event,
  }: {
    element: Student;
    $event: MouseEvent;
  }): void {
    element.expanded = !element.expanded;
    $event?.stopPropagation();
  }
}
