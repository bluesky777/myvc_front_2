import { Routes } from '@angular/router';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PiarComponent } from './pages/piar/piar.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'piar',
        component: PiarComponent,
      },
      {
        path: 'config',
        component: ConfigurationComponent,
      },
    ],
  },
];
