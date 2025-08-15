import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../app/components/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'stake',
    loadComponent: () =>
      import('./components/stake-unstake/stake-unstake.component').then(
        (m) => m.StakeUnstakeComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('../app/components/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
