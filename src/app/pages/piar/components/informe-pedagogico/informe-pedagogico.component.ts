import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-informe-pedagogico',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './informe-pedagogico.component.html',
  styleUrl: './informe-pedagogico.component.scss',
})
export class InformePedagogicoComponent {
  isShowing = false;

  showReports() {
    this.isShowing = !this.isShowing;
  }
}
