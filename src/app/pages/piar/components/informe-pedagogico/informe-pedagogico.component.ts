import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Student } from '../../../groups/models/student';
import { ProfileService } from '../../../../core/services/profile.service';
import { Sexo } from '../../../../core/models/profile';

@Component({
  selector: 'app-informe-pedagogico',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './informe-pedagogico.component.html',
  styleUrl: './informe-pedagogico.component.scss',
})
export class InformePedagogicoComponent {
  @Input() alumno!: Student;

  isShowing = false;

  constructor(private profileService: ProfileService) {}

  getImage(foto_nombre: string, sexo: string) {
    return this.profileService.getImage(foto_nombre, sexo as Sexo);
  }

  showReports() {
    this.isShowing = !this.isShowing;
  }
}
