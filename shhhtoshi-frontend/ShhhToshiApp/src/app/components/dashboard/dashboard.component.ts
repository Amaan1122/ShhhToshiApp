
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TonConnectService } from '../../services/ton-connect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(
    private readonly tonConnectService: TonConnectService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  connectWallet() {
    this.tonConnectService.initialize();
  }
}
