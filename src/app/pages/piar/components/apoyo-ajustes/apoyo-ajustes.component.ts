import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Asignatura } from '../../../../features/asignaturas/asignatura';
import { AsignaturasService } from '../../../../features/asignaturas/asignaturas.services';
import { DynamicTextareaComponent } from '../dynamic-textarea/dynamic-textarea.component';
import { Student } from '../../../groups/models/student';

@Component({
  selector: 'app-apoyo-ajustes',
  standalone: true,
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatSpinner,
    DynamicTextareaComponent,
  ],
  templateUrl: './apoyo-ajustes.component.html',
  styleUrl: './apoyo-ajustes.component.scss',
})
export class ApoyoAjustesComponent {
  @Input() alumno!: Student;

  asignaturas?: Asignatura[];

  selectedAsignatura?: Asignatura;

  loading = true;

  constructor(private asignaturasService: AsignaturasService) {}

  ngOnInit(): void {
    this.asignaturasService.getAsignaturas(this.alumno.id).subscribe({
      next: (res) => {
        this.asignaturas = res.asignaturas;
        this.loading = false;
      },
    });
  }

  onAsignaturaClick() {}
}
