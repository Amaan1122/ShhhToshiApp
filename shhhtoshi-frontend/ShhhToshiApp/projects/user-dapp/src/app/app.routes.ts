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
      import('../app/components/stake/stake.component').then(
        (m) => m.StakeComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('../app/components/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  {
    path: 'rewards',
    loadComponent: () =>
      import('../app/components/rewards/rewards.component').then(
        (m) => m.RewardsComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
