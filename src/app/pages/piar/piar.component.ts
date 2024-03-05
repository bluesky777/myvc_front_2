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

@Component({
  selector: 'app-piar',
  standalone: true,
  imports: [
    CommonModule,
    ContextoGrupoComponent,
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
      this.familiarContextService
        .getFamiliarContext(this.selectedGroup.id)
        .subscribe({
          next: (res: ApiResponse<GroupContextStudents>) => {
            this.familiarContext = res.data.familiarContext[0];
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
            console.log(err);
          },
        });
    }
  }

  onSaveGroupContext(familiarContext: GroupContext) {
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
