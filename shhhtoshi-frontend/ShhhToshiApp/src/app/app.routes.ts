import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
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
      import('./components/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },
  {
    path: 'referrals',
    loadComponent: () =>
      import('./components/referrals/referrals.component').then(
        (m) => m.ReferralsComponent
      ),
  },
  {
    path: 'wallet',
    loadComponent: () =>
      import('./components/wallet/wallet.component').then(
        (m) => m.WalletComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
