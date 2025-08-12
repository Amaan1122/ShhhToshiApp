import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { StakingComponent } from './components/staking/staking.component';
import { TasksComponent } from './components/tasks/tasks.component';

export const routes: Routes = [
  { path: '**', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'staking', component: StakingComponent },
  { path: 'tasks', component: TasksComponent },
];
