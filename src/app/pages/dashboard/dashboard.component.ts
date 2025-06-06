import { Component, OnInit } from '@angular/core';
import { CookieModule } from 'ngx-cookie';
import { ProfileService } from '../../core/services/profile.service';
import { YearsService } from '../../core/services/years.service';
import { SidenavComponent } from '../../features/sidenav/sidenav.component';
import { Profile } from './../../core/models/profile';
import { GroupsService } from './../../core/services/groups.service';
import { AuthService } from './services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CookieModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
    SidenavComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user?: Profile;

  opened = this.isProductNotActivated() ? false : true;

  authorizing = false;

  authorized = false;

  constructor(
    private authService: AuthService,
    private yearsService: YearsService,
    private groupsService: GroupsService,
    private profileService: ProfileService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authorizing = true;
    this.yearsService.getYears().subscribe({
      next: (res) => {
        // console.log(res);
      },
      error: () => {
        this.authorizing = false;
      },
    });

    this.yearsService.getPiarConfig().subscribe({
      next: (res) => {
        // console.log(res);
      },
    });

    this.profileService.getData().subscribe({
      next: (user: unknown) => {
        if ((user as Array<any>).length === 0) {
          this.authorized = false;
        } else {
          this.user = user as Profile;
          this.authorized = true;
        }
        this.authorizing = false;
      },
    });
  }

  isDashboard(): boolean {
    return this.router.url === '/';
  }

  isProductNotActivated(): boolean {
    const currentHostname = document.location.hostname;
    const notActivatedDomains = [
      'amiguitosdejesus.micolevirtual.com',
      'bethel.micolevirtual.com',
      'bethelexplora.micolevirtual.com',
      'cads.micolevirtual.com',
      'caz.micolevirtual.com',
      'coaf.micolevirtual.com',
      'coal.micolevirtual.com',
      'colbosque.micolevirtual.com',
      'coljordan.micolevirtual.com',
      'comad.micolevirtual.com',
      'eal.micolevirtual.com',
      'inseaq.micolevirtual.com',
      'maranatha.micolevirtual.com',
      'semillitasdedios.micolevirtual.com',
      'lalvirtual.edu.co',
      // 'localhost',
    ];
    return notActivatedDomains.includes(currentHostname);
  }
}
