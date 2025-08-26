import { Routes } from '@angular/router';
import { WalletGuard } from './guards/wallet.guard';

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
    canActivate: [WalletGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('../app/components/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
    canActivate: [WalletGuard],
  },
  {
    path: 'referrals',
    loadComponent: () =>
      import('../app/components/referrals/referrals.component').then(
        (m) => m.ReferralsComponent
      ),
    canActivate: [WalletGuard],
  },
  {
    path: 'wallet',
    loadComponent: () =>
      import('../app/components/wallet/wallet.component').then(
        (m) => m.WalletComponent
      ),
    canActivate: [WalletGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../app/components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [WalletGuard],
  },
  { path: '**', redirectTo: '' },
];
