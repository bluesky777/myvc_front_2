import { CookieModule, CookieService } from 'ngx-cookie';
import { YearsService } from '../../core/services/years.service';
import { GroupsService } from './../../core/services/groups.service';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CookieModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private yearsService: YearsService,
    private groupsService: GroupsService
  ) {}

  ngOnInit(): void {
    this.authService.getYears().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
    this.groupsService.getGroups().subscribe({
      next: (res) => {
        console.log(res);
      },
    });
    console.log(localStorage.getItem('xtoken'));
  }
}
