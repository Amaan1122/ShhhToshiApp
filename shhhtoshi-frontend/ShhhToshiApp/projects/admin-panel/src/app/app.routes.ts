import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('../app/components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'tasks', loadComponent: () => import('../app/components/tasks/tasks.component').then(m => m.TasksComponent) },
  { path: 'rewards', loadComponent: () => import('../app/components/rewards/rewards.component').then(m => m.RewardsComponent) },
  { path: 'users', loadComponent: () => import('../app/components/users/users.component').then(m => m.UsersComponent) },
  { path: '**', redirectTo: '' }
];
