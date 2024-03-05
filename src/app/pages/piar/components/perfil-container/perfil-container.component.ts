import { Component, Input } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { Student } from '../../../groups/models/student';
import { Sexo } from '../../../../core/models/profile';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-container.component.html',
  styleUrl: './perfil-container.component.scss',
})
export class PerfilContainerComponent {
  @Input() alumno!: Student;

  constructor(private profileService: ProfileService) {}

  getImage(foto_nombre: string, sexo: string) {
    return this.profileService.getImage(foto_nombre, sexo as Sexo);
  }
}
