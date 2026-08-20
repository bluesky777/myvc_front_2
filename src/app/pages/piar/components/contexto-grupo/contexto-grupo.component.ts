import { ProfileService } from './../../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Editor, NgxEditorModule, toHTML } from 'ngx-editor';
import { toolbarDefaultOptions } from '../../../../shared/config/toolbar-options';
import { GroupContext } from './models/familiar-grupo';

@Component({
  selector: 'app-contexto-grupo',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    MatButton,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contexto-grupo.component.html',
  styleUrl: './contexto-grupo.component.scss',
})
export class ContextoGrupoComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ alias: 'record' }) contextoGrupoRecord?: GroupContext;

  @Input() loading = true;

  @Input() savingContext = false;

  @Input() titular_id!: number;

  @Output() saveContext = new EventEmitter<GroupContext>();

  editor!: Editor;

  form?: FormGroup;

  toolbar = toolbarDefaultOptions;

  hasEditingPermissions = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.editor = new Editor();
    this.setHasEditingPermissions();
    this.createForm();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  /**
   * El componente no se recrea al cambiar de grupo (el `@if` del padre sigue
   * siendo verdadero), así que hay que recalcular permisos y contenido aquí.
   * En el primer ciclo `form` aún no existe: lo construye `ngOnInit`.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['titular_id']) {
      this.setHasEditingPermissions();
      this.applyEditingPermissions();
    }

    if (changes['contextoGrupoRecord'] && this.form) {
      this.form
        .get('editorContent')
        ?.setValue(this.contextoGrupoRecord?.caracterizacion_grupo ?? '');
    }
  }

  private applyEditingPermissions(): void {
    const control = this.form?.get('editorContent');
    if (!control) return;

    if (this.hasEditingPermissions) {
      control.enable({ emitEvent: false });
    } else {
      control.disable({ emitEvent: false });
    }
  }

  get doc(): FormControl {
    return this.form!.get('editorContent') as FormControl;
  }

  setHasEditingPermissions(): void {
    this.hasEditingPermissions = !!(
      this.profileService.isTitular(this.titular_id) ||
      this.profileService.user?.is_superuser
    );
  }

  createForm() {
    this.form = new FormGroup({
      editorContent: new FormControl({
        value: this.contextoGrupoRecord?.caracterizacion_grupo || '',
        disabled: !this.hasEditingPermissions,
      }),
    });
  }

  save() {
    const html =
      typeof this.doc.value === 'string'
        ? this.doc.value
        : toHTML(this.doc.value);
    this.saveContext.emit({
      ...this.contextoGrupoRecord,
      caracterizacion_grupo: html,
    } as GroupContext);
  }
}
