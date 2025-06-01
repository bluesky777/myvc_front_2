import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Asignatura } from '../../../../features/asignaturas/asignatura';
import { AsignaturasService } from '../../../../features/asignaturas/asignaturas.services';
import { Group } from '../../../groups/models/groups';
import { Student } from '../../../groups/models/student';
import { DynamicTextareaComponent } from '../dynamic-textarea/dynamic-textarea.component';
import { ProfileService } from '../../../../core/services/profile.service';

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

  @Input() selectedGroup!: Group;

  asignaturas?: Asignatura[];

  selectedAsignatura?: Asignatura;

  loading = true;

  loadingAsignaturas = false;

  constructor(
    private asignaturasService: AsignaturasService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.asignaturasService
      .getAsignaturas(this.selectedGroup.id, this.alumno.id)
      .subscribe({
        next: (asignaturas: Asignatura[]) => {
          this.asignaturas = asignaturas.filter((asignatura) => {
            return asignatura.grupo_id === this.selectedGroup.id;
          });
          this.loading = false;
        },
      });
  }

  onAsignaturaClick() {
    this.loadingAsignaturas = true;
    setTimeout(() => {
      this.loadingAsignaturas = false;
    }, 500);
  }

  hasDocenteOrAdminPermissions(docente_asignatura_id: number) {
    return !!(
      this.profileService.user?.persona_id === docente_asignatura_id ||
      this.profileService.user?.is_superuser
    );
  }
}
