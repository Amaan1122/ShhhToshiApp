import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TonConnectService } from '../../services/ton-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private readonly tonConnectService: TonConnectService, private readonly route: Router) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.tonConnectService.walletData$.subscribe((wallet) => {
      if (wallet?.account?.address) {
        const walletAddress = wallet.account.address;
        // this.walletService.getWalletInfo(walletAddress);
      }
    });
  }

  disconnectWallet(){
    this.tonConnectService.disconnect();
    this.route.navigate(['home']);
  }
}
