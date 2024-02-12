import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FamiliarContextService } from '../../core/services/familiar-context.service';
import { StudentService } from '../../core/services/student.service';
import { Group } from '../groups/models/groups';
import { GroupsService } from './../../core/services/groups.service';
import { TablePiarComponent } from './components/table-piar/table-piar.component';
import { ContextoFamiliarComponent } from './contexto-familiar/contexto-familiar.component';
import { FamiliarContext } from './contexto-familiar/models/familiar-context';
import { ApiResponse } from '../../core/models/api-response';

@Component({
  selector: 'app-piar',
  standalone: true,
  imports: [
    CommonModule,
    ContextoFamiliarComponent,
    MatButtonToggleModule,
    TablePiarComponent,
  ],
  templateUrl: './piar.component.html',
  styleUrl: './piar.component.scss',
})
export class PiarComponent implements OnInit {
  groups?: Group[];
  selectedGroup?: string;
  familiarContext?: FamiliarContext[];
  students?: any[];

  constructor(
    private groupsService: GroupsService,
    private familiarContextService: FamiliarContextService,
    private studentService: StudentService,
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
      this.familiarContextService
        .getFamiliarContext(this.selectedGroup)
        .subscribe({
          next: (res: ApiResponse<FamiliarContext[]>) => {
            this.familiarContext = res.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
}
