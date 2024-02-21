import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
import { toolbarDefaultOptions } from '../../../../shared/config/toolbar-options';
import { DynamicTextareaObject } from './models/dynamic-textarea-object';

@Component({
  selector: 'app-dynamic-textarea',
  standalone: true,
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    MatButton,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dynamic-textarea.component.html',
  styleUrl: './dynamic-textarea.component.scss',
})
export class DynamicTextareaComponent implements OnInit, OnDestroy {
  @Input({ alias: 'record' }) dataText?: DynamicTextareaObject;

  @Output() saveContext = new EventEmitter<DynamicTextareaObject>();

  @Input() saving = false;

  editor!: Editor;

  editing = false;

  form = new FormGroup({
    editorContent: new FormControl({
      value: this.dataText || '',
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

  get doc(): FormControl {
    return this.form.get('editorContent') as FormControl;
  }

  save() {
    this.saveContext.emit({
      ...this.dataText,
      caracterizacion_grupo: this.doc.value,
    } as DynamicTextareaObject);
  }

  cancel() {
    this.editing = false;
  }

  startEdition() {
    this.editing = true;
  }
}
