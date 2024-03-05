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

  form = new FormGroup({
    editorContent: new FormControl({
      value: this.contextoGrupoRecord?.caracterizacion_grupo || '',
      disabled: false,
    }),
  });

  toolbar = toolbarDefaultOptions;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.editor = new Editor();
    const user = this.profileService.user;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const groupContext = changes['contextoGrupoRecord']?.currentValue;
    if (groupContext) {
      this.form
        .get('editorContent')
        ?.setValue(groupContext.caracterizacion_grupo);
    }
  }

  get doc(): FormControl {
    return this.form.get('editorContent') as FormControl;
  }

  hasEditingPermissions(): boolean {
    return !!(
      this.profileService.isTitular(this.titular_id) ||
      this.profileService.user?.is_superuser
    );
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
