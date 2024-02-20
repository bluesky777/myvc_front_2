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
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FamiliarContext } from './models/familiar-context';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }, 'link', 'horizontal_rule'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

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
