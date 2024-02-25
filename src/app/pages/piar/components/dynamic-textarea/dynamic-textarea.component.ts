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
import { DomSanitizer } from '@angular/platform-browser';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { toolbarDefaultOptions } from '../../../../shared/config/toolbar-options';
import { StudentContextService } from '../table-piar/services/student-context.service';
import { DynamicTextareaObject } from './models/dynamic-textarea-object';

@UntilDestroy()
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
  @Input() dataText?: string;

  @Input() dataField?: string;

  @Input() dataId?: number;

  @Output() saveText = new EventEmitter<DynamicTextareaObject>();

  @Input() saving = false;

  editor!: Editor;

  editing = false;

  form!: FormGroup;

  toolbar = toolbarDefaultOptions;

  constructor(
    private studentContextService: StudentContextService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      editorContent: new FormControl({
        value: this.dataText || '',
        disabled: false,
      }),
    });
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get doc(): FormControl {
    return this.form.get('editorContent') as FormControl;
  }

  save() {
    const data = {
      id: this.dataId,
      text: this.doc.value,
      field: this.dataField,
    } as DynamicTextareaObject;

    this.studentContextService
      .updateField(data)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Texto guardado.');
        },
        error: (res: any) => {
          this.toastr.error('Error guardado texto.');
        },
      });
  }

  cancel() {
    this.editing = false;
  }

  startEdition() {
    this.editing = true;
  }

  getSanitizedText() {
    return this.sanitizer.bypassSecurityTrustHtml(this.dataText || '');
  }
}
