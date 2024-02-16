import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ApiResponse } from '../../core/models/api-response';
import { FamiliarContextService } from '../../core/services/familiar-context.service';
import { StudentService } from '../../core/services/student.service';
import { Group } from '../groups/models/groups';
import { GroupsService } from './../../core/services/groups.service';
import { TablePiarComponent } from './components/table-piar/table-piar.component';
import { ContextoFamiliarComponent } from './contexto-familiar/contexto-familiar.component';
import { FamiliarContext } from './contexto-familiar/models/familiar-context';

@Component({
  selector: 'app-piar',
  standalone: true,
  imports: [
    CommonModule,
    ContextoFamiliarComponent,
    MatButtonToggleModule,
    TablePiarComponent,
    ToastrModule,
  ],
  templateUrl: './piar.component.html',
  styleUrl: './piar.component.scss',
})
export class PiarComponent implements OnInit {
  groups?: Group[];
  selectedGroup?: string;
  familiarContext?: FamiliarContext;
  students?: any[];
  loadingContextoFamiliar = false;
  savingFamiliarContext = false;

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
      this.loadingContextoFamiliar = true;
      this.familiarContextService
        .getFamiliarContext(this.selectedGroup)
        .subscribe({
          next: (res: ApiResponse<FamiliarContext[]>) => {
            this.familiarContext = res.data[0];
            this.loadingContextoFamiliar = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  onSaveFamiliarContext() {
    this.savingFamiliarContext = true;
    this.familiarContextService
      .saveFamiliarContext(this.familiarContext as FamiliarContext)
      .subscribe({
        next: (res: ApiResponse<FamiliarContext>) => {
          this.toastr.success('Contexto familiar guardado');
        },
        error: (err) => {
          this.toastr.error('Error guardando contexto familiar');
        },
        complete: () => (this.savingFamiliarContext = false),
      });
  }
}
