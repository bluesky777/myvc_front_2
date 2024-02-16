import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './contexto-familiar.component.html',
  styleUrl: './contexto-familiar.component.scss',
})
export class ContextoFamiliarComponent implements OnInit, OnDestroy {
  @Input({ alias: 'record' }) contextoFamiliarRecord?: FamiliarContext;

  @Input() loading = true;

  @Input() savingContext = false;

  @Output() saveContext = new EventEmitter<FamiliarContext>();

  editor!: Editor;

  toolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3'] }, 'link', 'horizontal_rule'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  html = '';

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  save() {
    this.saveContext.emit(this.contextoFamiliarRecord);
  }
}
