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
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Student } from '../../../groups/models/student';

@Component({
  selector: 'app-table-piar',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
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

  columnsToDisplay = ['index', 'apellidos', 'nombres', 'sexo'];

  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const alumnos = changes['alumnos']?.currentValue as Student[];
    if (alumnos) {
      this.alumnos = alumnos.map((alumno, index) => ({
        ...alumno,
        index: index + 1,
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
