import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Editor, NgxEditorModule, toHTML } from 'ngx-editor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { IMAGES_URL } from '../../../../core/CONSTANTS_URL';
import {
  PiarConfig,
  PiarConfigRespose,
  YearReport,
} from '../../../../core/models/piar-config';
import { Sexo } from '../../../../core/models/profile';
import { ProfileService } from '../../../../core/services/profile.service';
import { toolbarDefaultOptions } from '../../../../shared/config/toolbar-options';
import { Group } from '../../../groups/models/groups';
import { Student } from '../../../groups/models/student';
import { StudentContextService } from '../table-piar/services/student-context.service';
import { YearsService } from './../../../../core/services/years.service';
import { DynamicTextareaObject } from '../dynamic-textarea/models/dynamic-textarea-object';

@UntilDestroy()
@Component({
  selector: 'app-informe-pedagogico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NgxEditorModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    ToastrModule,
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

  year?: YearReport;

  piarConfig?: PiarConfig;

  IMAGES_URL = IMAGES_URL;

  editor!: Editor;

  savingText = false;

  form!: FormGroup;

  toolbar = toolbarDefaultOptions;

  showingEditor = true;

  constructor(
    private profileService: ProfileService,
    private yearsService: YearsService,
    private sanitizer: DomSanitizer,
    private studentContextService: StudentContextService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.yearsService.piarConfig
      .pipe(untilDestroyed(this))
      .subscribe((piarConfigRes: PiarConfigRespose) => {
        this.piarConfig = piarConfigRes.piarsConfig;
        this.year = piarConfigRes.year;
        this.setForm();
      });
  }

  setForm() {
    let initialText = this.alumno.studentPiar?.reporte;

    if (
      (this.alumno.studentPiar?.reporte === null ||
        this.alumno.studentPiar?.reporte === '' ||
        this.alumno.studentPiar?.reporte === '<p></p>') &&
      this.piarConfig?.reporte_default
    ) {
      initialText = this.piarConfig!.reporte_default;
    }

    this.form = new FormGroup({
      editorContent: new FormControl({
        value: initialText,
        disabled: false,
      }),
    });

    this.editor = new Editor();
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

  cancel() {
    this.showingEditor = false;
    this.savingText = false;
  }

  edit() {
    this.showingEditor = true;
  }

  save() {
    if (this.savingText) {
      return;
    }
    this.savingText = true;
    const html =
      typeof this.editorContent.value === 'string'
        ? this.editorContent.value
        : toHTML(this.editorContent.value);

    const data = {
      id: this.alumno.studentPiar?.id,
      text: html,
      field: 'reporte',
    } as DynamicTextareaObject;

    this.studentContextService
      .updateField(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Texto guardado.');
          this.savingText = false;
        },
        error: (res: any) => {
          this.toastr.error('Error guardado texto.');
          this.savingText = false;
        },
      });
  }

  get editorContent() {
    return this.form.get('editorContent') as FormControl;
  }
}
