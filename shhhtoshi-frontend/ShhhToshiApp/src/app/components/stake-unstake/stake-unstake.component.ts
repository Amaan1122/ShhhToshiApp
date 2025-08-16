import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeUnstakeModel } from '../../models/stakeUnstakeModel';
import { FooterComponent } from '../footer/footer.component';
import { StakeUnstakeService } from '../../services/stake-unstake.service';
import { TonConnectService } from '../../services/ton-connect.service';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-stake-unstake',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stake-unstake.component.html',
  styleUrl: './stake-unstake.component.css',
})
export class StakeUnstakeComponent {
  walletAddress = '';
  walletBalance = 0;
  stakedAmount = 0;
  stakeAmount = 0;
  unstakeAmount = 0;
  estimatedReward = 0;

  @Input({ required: true }) model!: StakeUnstakeModel;

  constructor(
    private readonly walletService: WalletService,
    private readonly stakeUnstakeService: StakeUnstakeService,
    private readonly tonConnectService: TonConnectService,
    private readonly route: Router
  ) {
    this.model = new StakeUnstakeModel();
  }

  ngOnInit() {
    this.initialize();
  }

  onAmountInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.model.setAmount(Number(target.value));
  }

  onInputKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.model.isButtonEnabled()) {
      const btn = document.querySelector<HTMLButtonElement>('#submit');
      btn?.click();
      (event.target as HTMLInputElement).blur();
    }
  }

  submit(): void {
    if (this.model.isWalletConnected()) {
      if (this.model.isStakeTabActive()) {
        this.stakeNow();
      } else if (!this.model.isStakeTabActive) {
        this.unstakeNow();
      }
    } else {
      this.model.connect();
    }
  }

  initialize() {
    const connectedWalletAddress =
      this.tonConnectService.getCurrentWalletAddress();
    if (connectedWalletAddress) {
      this.model.connect();
    }
    this.walletService
      .getWalletInfo(connectedWalletAddress)
      .subscribe((info) => {
        this.walletAddress = info.address;
        this.walletBalance = info.balance;
        this.stakedAmount = info.stakedAmount;
        this.calculateReward(info.lastStakedAt);
      });
  }

  calculateReward(lastStakedAt: string) {
    const days =
      (Date.now() - new Date(lastStakedAt).getTime()) / (1000 * 60 * 60 * 24);
    this.estimatedReward = this.stakedAmount * 0.01 * days;
  }

  stakeNow() {
    this.stakeUnstakeService
      .stake(this.walletAddress, this.model.amount())
      .subscribe(() => this.ngOnInit());
  }

  unstakeNow() {
    this.stakeUnstakeService
      .unstake(this.walletAddress, this.model.amount())
      .subscribe(() => this.ngOnInit());
  }

  claimRewards() {
    this.stakeUnstakeService
      .claimRewards(this.walletAddress)
      .subscribe(() => this.ngOnInit());
  }

  disconnectWallet() {
    this.tonConnectService.disconnect();
    this.route.navigate(['home']);
  }
}
