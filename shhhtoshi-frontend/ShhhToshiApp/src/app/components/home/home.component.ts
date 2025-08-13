import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TonConnectService } from '../../services/ton-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  wallet: any;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly tonConnectService: TonConnectService,
    private readonly route: Router
  ) {}

  ngOnInit(): void {
    this.tonConnectService.walletData$.subscribe((wallet) => {
      if (wallet?.account?.address) {
        console.log('✅ Wallet connected:', wallet.account.address);
        this.route.navigate(['stake']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tonConnectService.initialize();
  }

  getWalletInfo() {
    console.log('Wallet info:', this.wallet);
  }
}
