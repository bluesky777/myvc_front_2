import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../core/models/api-response';
import { FamiliarContextService } from '../../core/services/familiar-context.service';
import { StudentService } from '../../core/services/student.service';
import { Group } from '../groups/models/groups';
import { Student } from '../groups/models/student';
import { GroupsService } from './../../core/services/groups.service';
import { TablePiarComponent } from './components/table-piar/table-piar.component';
import { ContextoGrupoComponent } from './components/contexto-grupo/contexto-grupo.component';
import {
  GroupContext,
  GroupContextStudents,
  StudentPiar,
} from './components/contexto-grupo/models/familiar-grupo';
import {
  InformePedagogicoService,
  StudentAndGroup,
} from './components/informe-pedagogico/services/informe-pedagogico.services';
import { InformePedagogicoComponent } from './components/informe-pedagogico/informe-pedagogico.component';

@Component({
  selector: 'app-piar',
  standalone: true,
  imports: [
    CommonModule,
    ContextoGrupoComponent,
    InformePedagogicoComponent,
    MatButtonToggleModule,
    TablePiarComponent,
    ToastrModule,
],
  templateUrl: './piar.component.html',
  styleUrl: './piar.component.scss',
})
export class PiarComponent implements OnInit {
  groups?: Group[];

  selectedGroup?: Group;

  familiarContext?: GroupContext;

  students?: any[];

  loadingGroupData = false;

  savingGroupContext = false;

  alumnos: Student[] = [];

  alumnosPiar: StudentPiar[] = [];

  constructor(
    private groupsService: GroupsService,
    private familiarContextService: FamiliarContextService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private informePedagogicoService: InformePedagogicoService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.groupsService.getGroups().subscribe({
      next: (res) => {
        this.groups = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onGroupClick() {
    if (this.selectedGroup) {
      this.loadingGroupData = true;
      // Sin esto, si la carga falla se siguen mostrando los alumnos y el
      // contexto del grupo anterior bajo el encabezado del grupo nuevo.
      this.familiarContext = undefined;
      this.alumnos = [];

      this.familiarContextService
        .getFamiliarContext(this.selectedGroup.id)
        .subscribe({
          next: (res: ApiResponse<GroupContextStudents>) => {
            this.familiarContext = res.data.familiarContext?.[0];

            if (this.selectedGroup) {
              this.selectedGroup.firma_titular_nombre =
                res.data.grupo.firma_titular_nombre;
              this.selectedGroup.firma_id = res.data.grupo.firma_id;
            }

            this.alumnos = res.data.alumnos.map((alumno) => {
              const alumno_piar = res.data.alumnos_piar.filter(
                (alum) => alum.alumno_id === alumno.id,
              );
              return {
                ...alumno,
                studentPiar:
                  alumno_piar.length > 0 ? alumno_piar[0] : undefined,
              };
            });
            this.loadingGroupData = false;
          },
          error: (err) => {
            this.loadingGroupData = false;
            console.error('Error cargando el contexto del grupo', err);
            this.toastr.error('Error cargando los datos del grupo');
          },
        });
    }
  }

  onSaveGroupContext(familiarContext: GroupContext) {
    // `putContextoDeGrupo` solo usa `id` y `caracterizacion_grupo`, y es un
    // UPDATE: sin `id` no afecta a ninguna fila y el usuario vería un
    // "guardado" que no guardó nada. La fila la crea el GET del grupo.
    if (!familiarContext.id) {
      this.toastr.error('No se pudo guardar: falta el contexto del grupo');
      return;
    }

    this.savingGroupContext = true;

    this.familiarContextService.saveGroupContext(familiarContext).subscribe({
      next: (res: ApiResponse<GroupContext>) => {
        this.savingGroupContext = false;
        this.toastr.success('Contexto familiar guardado');
      },
      error: (err) => {
        this.savingGroupContext = false;
        this.toastr.error('Error guardando contexto familiar');
      },
    });
  }
}
