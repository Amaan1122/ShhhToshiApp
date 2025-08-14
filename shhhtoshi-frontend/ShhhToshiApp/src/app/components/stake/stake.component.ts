import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TonConnectService } from '../../services/ton-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stake',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stake.component.html',
  styleUrl: './stake.component.css',
})
export class StakeComponent implements OnInit {
  walletAddress = '';
  walletBalance = 0;
  stakedAmount = 0;
  stakeAmount = 0;
  unstakeAmount = 0;
  estimatedReward = 0;

  constructor(
    private readonly walletService: WalletService,
    private readonly tonConnectService: TonConnectService,
    private readonly route: Router
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    const connectedWalletAddress =
      this.tonConnectService.getCurrentWalletAddress();
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
    this.walletService
      .stake(this.walletAddress, this.stakeAmount)
      .subscribe(() => this.ngOnInit());
  }

  unstakeNow() {
    this.walletService
      .unstake(this.walletAddress, this.unstakeAmount)
      .subscribe(() => this.ngOnInit());
  }

  claimRewards() {
    this.walletService
      .claimRewards(this.walletAddress)
      .subscribe(() => this.ngOnInit());
  }

  disconnectWallet() {
    this.tonConnectService.disconnect();
    this.route.navigate(['home']);
  }
}
