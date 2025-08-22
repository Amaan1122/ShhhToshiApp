import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TonConnectService } from '../../services/ton-connect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly tonConnectService: TonConnectService,
    private readonly walletService: WalletService,
    private readonly route: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.tonConnectService.walletConnected$.subscribe((connected) => {
      if (connected) {
        // Set the wallet user in database
        const walletAddress = this.tonConnectService.getCurrentWalletAddress();
        this.setWalletUser(walletAddress);
        // Navigate to the return URL
        const returnUrl =
          this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
          '/dashboard';
        this.route.navigateByUrl(returnUrl);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tonConnectService.initialize();
  }

  setWalletUser(walletAddress: string) {
    this.walletService.setWalletUser(walletAddress).subscribe({
      next: () => {
        console.log('Wallet address saved sucessfully');
      },
      error: (error) => {
        console.log('Error while saving wallet address in database', error);
      },
    });
  }
}
