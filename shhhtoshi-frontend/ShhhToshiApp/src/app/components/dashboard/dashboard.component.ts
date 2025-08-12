import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  TonConnectUI,
  TonConnectUiCreateOptions,
  Wallet,
} from '@tonconnect/ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  walletSaved = false;
  tonConnectUI!: TonConnectUI;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // We're on the server, exit early.
      return;
    }

    const options: TonConnectUiCreateOptions = {
      manifestUrl: 'https://localhost:4200/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button',
    };

    this.tonConnectUI = new TonConnectUI(options);

    this.tonConnectUI.onStatusChange((wallet: Wallet | null) => {
      if (wallet?.account?.address) {
        const walletAddress = wallet.account.address;
        localStorage.setItem('walletAddress', walletAddress);
        console.log('✅ Wallet connected:', walletAddress);

        // Send to backend
        // fetch('https://localhost:5000/api/user/save-user', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ wallet: walletAddress }),
        // })
        //   .then((res) => res.json())
        //   .then((data) => {
        //     console.log('✅ Wallet info saved:', data);
        //     this.walletSaved = true;
        //   })
        //   .catch((err) => {
        //     console.error('❌ Save error:', err);
        //   });
      }
    });
  }
}
