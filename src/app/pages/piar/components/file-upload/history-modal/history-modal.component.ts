import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface HistoryItem {
  documento1: string;
  documento2: string;
  updated_at: string;
  updated_by: number;
  updated_by_name: string;
}

@Component({
  selector: 'app-history-modal',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
  ],
  templateUrl: './history-modal.component.html',
  styleUrl: './history-modal.component.scss',
})
export class HistoryModalComponent {
  history: HistoryItem[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    try {
      this.history = JSON.parse(data);
    } catch (error) {}
  }
}
