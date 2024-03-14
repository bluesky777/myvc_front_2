import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Sexo } from '../../../../core/models/profile';
import { ProfileService } from '../../../../core/services/profile.service';
import { Student } from '../../../groups/models/student';
import { Year } from './../../../../core/models/year';
import { YearsService } from './../../../../core/services/years.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { IMAGES_URL } from '../../../../core/CONSTANTS_URL';
import { Group } from '../../../groups/models/groups';

@UntilDestroy()
@Component({
  selector: 'app-informe-pedagogico',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './informe-pedagogico.component.html',
  styleUrl: './informe-pedagogico.component.scss',
})
export class InformePedagogicoComponent implements OnInit {
  @Input() alumno!: Student;

  @Input() grupo!: Group;

  isShowingReport = false;

  isShowingLogo = true;

  isShowingFoto = true;

  isShowingFirmaRector = true;

  isShowingFirmaTitular = true;

  year?: Year;

  IMAGES_URL = IMAGES_URL;

  constructor(
    private profileService: ProfileService,
    private yearsService: YearsService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.yearsService.currentYear
      .pipe(untilDestroyed(this))
      .subscribe((year) => {
        this.year = year;
      });
  }

  getImage(foto_nombre: string, sexo: string) {
    return this.profileService.getImage(foto_nombre, sexo as Sexo);
  }

  showReports() {
    this.isShowingReport = !this.isShowingReport;
  }

  getSanitizedText(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}
