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
import { Editor, NgxEditorModule } from 'ngx-editor';
import { toolbarDefaultOptions } from '../../../shared/config/toolbar-options';
import { FamiliarContext } from './models/familiar-context';

@Component({
  selector: 'app-contexto-familiar',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    MatButton,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contexto-familiar.component.html',
  styleUrl: './contexto-familiar.component.scss',
})
export class ContextoFamiliarComponent implements OnInit, OnDestroy, OnChanges {
  @Input({ alias: 'record' }) contextoFamiliarRecord?: FamiliarContext;

  @Input() loading = true;

  @Input() savingContext = false;

  @Output() saveContext = new EventEmitter<FamiliarContext>();

  editor!: Editor;

  form = new FormGroup({
    editorContent: new FormControl({
      value: this.contextoFamiliarRecord?.caracterizacion_grupo || '',
      disabled: false,
    }),
  });

  toolbar = toolbarDefaultOptions;

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const familiarContext = changes['contextoFamiliarRecord']?.currentValue;
    if (familiarContext) {
      this.form
        .get('editorContent')
        ?.setValue(familiarContext.caracterizacion_grupo);
    }
  }

  get doc(): FormControl {
    return this.form.get('editorContent') as FormControl;
  }

  save() {
    this.saveContext.emit({
      ...this.contextoFamiliarRecord,
      caracterizacion_grupo: this.doc.value,
    } as FamiliarContext);
  }
}
