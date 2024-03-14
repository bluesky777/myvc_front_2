import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import '@fontsource/open-sans';
import '@fontsource/open-sans/700.css'; // Specify weight
import '@fontsource/open-sans/700-italic.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'myvc_front_2';
}
