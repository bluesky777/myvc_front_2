import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { FamiliarContext } from './models/familiar-context';

@Component({
  selector: 'app-contexto-familiar',
  standalone: true,
  imports: [CommonModule, NgxEditorModule, FormsModule],
  templateUrl: './contexto-familiar.component.html',
  styleUrl: './contexto-familiar.component.scss',
})
export class ContextoFamiliarComponent implements OnInit, OnDestroy {
  @Input({ alias: 'records' }) contextoFamiliarRecords?: FamiliarContext[];

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
}
