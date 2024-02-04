import { GroupsService } from './../../core/services/groups.service';
import { Component, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Group } from '../groups/models/groups';
import { StudentService } from '../../core/services/student.service';
import { CommonModule } from '@angular/common';
import { TablePiarComponent } from './components/table-piar/table-piar.component';

@Component({
  selector: 'app-piar',
  standalone: true,
  imports: [MatButtonToggleModule, CommonModule, TablePiarComponent],
  templateUrl: './piar.component.html',
  styleUrl: './piar.component.scss',
})
export class PiarComponent implements OnInit {
  groups?: Group[];
  selectedGroup?: string;
  students?: any[];

  constructor(
    private groupsService: GroupsService,
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
      this.studentService.getStudents(this.selectedGroup).subscribe({
        next: (res) => {
          this.students = res;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
