import { CookieModule, CookieService } from 'ngx-cookie';
import { YearsService } from '../../core/services/years.service';
import { GroupsService } from './../../core/services/groups.service';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from '../../features/sidenav/sidenav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CookieModule, SidenavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private yearsService: YearsService,
    private groupsService: GroupsService,
  ) {}

  ngOnInit(): void {
    this.authService.getYears().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
