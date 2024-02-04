import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

interface ItemNav {
  title: string;
  route: string;
  items?: SubItem[];
}

interface SubItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  navigationGroups: ItemNav[] = [
    {
      title: 'Dashboard',
      route: '/',
    },
    {
      title: 'PIAR',
      route: '/piar',
    },
    // {
    //   title: 'Profile',
    //   route: '/profile',
    //   items: [
    //     { label: 'Item 1.1', route: '/item1' },
    //     { label: 'Item 1.2', route: '/item2' },
    //   ],
    // },
    // {
    //   title: 'Configuración',
    //   route: '/configuracion',
    //   items: [
    //     { label: 'Config 1.1', route: '/config1' },
    //     { label: 'Config 1.2', route: '/config2' },
    //   ],
    // },
  ];
}
