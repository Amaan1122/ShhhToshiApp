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
import { WalletService } from '../../services/wallet.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  wallet: any;
  walletAddress: string = '';

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly tonConnectService: TonConnectService,
    private readonly walletService: WalletService,
    private readonly route: Router
  ) {}

  ngOnInit(): void {
    this.tonConnectService.walletData$.subscribe((wallet) => {
      if (wallet?.account?.address) {
        const walletAddress = wallet.account.address;
        this.getWalletInfo();
        this.walletService.getWalletInfo(walletAddress);
        this.saveWalletAddress(this.walletAddress);
        this.route.navigate(['stake']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tonConnectService.initialize();
  }

  saveWalletAddress(walletAddress: string) {
    this.walletService.setWalletAddress(walletAddress).subscribe({
      next: () => {
        console.log('Wallet address saved sucessfully');
      },
      error: (error) => {
        console.log('Error while saving wallet address in database', error);
      },
    });
  }

  getWalletInfo() {
    this.wallet = this.tonConnectService.getWalletInfo();
    this.walletAddress = this.tonConnectService.getCurrentWalletAddress();
    console.log('Wallet Info :', this.wallet);
    console.log('Wallet Address :', this.walletAddress);
  }
}
