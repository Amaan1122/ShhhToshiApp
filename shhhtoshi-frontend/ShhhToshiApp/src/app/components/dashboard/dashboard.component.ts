import { Component } from '@angular/core';

interface TransactionHistoryItem {
  type: 'Reward' | 'Stake' | 'Unstake';
  amount: number;
  date: string; // ISO string
  status: 'completed' | 'pending';
}

import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TonConnectService } from '../../services/ton-connect.service';
import { WalletInfoModel } from '../../models/WalletInfoModel';
import { WalletService } from '../../services/wallet.service';
import { TasksService } from '../../services/tasks.service';
import { StakeUnstakeService } from '../../services/stake-unstake.service';
import { StakeUnstakeEventModel } from '../../models/StakeUnstakeEventModel';
import { ClaimHistoryItem } from '../../models/TasksModel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  public transactionHistory: TransactionHistoryItem[] = [];
  walletInfo?: WalletInfoModel;
  totalRewardEarned: number = 0;
  daysStaked: number = 0;
  readonly targetDays: number = 90;
  progressPercent: number = 0;
  totalClaims: number = 0;
  lastClaimedAt?: string;

  constructor(
    private readonly tonConnectService: TonConnectService,
    private readonly walletService: WalletService,
    private readonly tasksService: TasksService,
    private readonly stakeUnstakeService: StakeUnstakeService
  ) {}

  ngOnInit() {
    this.initialize().then(() => {
      this.calculateDaysStaked();
      this.getTotalRewardEarned();
      this.getClaimHistory();
      this.loadTransactionHistory();
    });
  }
  loadTransactionHistory() {
    if (!this.walletInfo?.walletAddress) return;
    // Fetch both histories in parallel
    this.stakeUnstakeService.getStakeUnstakeHistory(this.walletInfo.walletAddress).subscribe((stakeEvents: StakeUnstakeEventModel[]) => {
      this.tasksService.getClaimHistory(this.walletInfo!.walletAddress).subscribe((claimHistory: ClaimHistoryItem[]) => {
        // Map stake/unstake events
        const stakeTxs: TransactionHistoryItem[] = stakeEvents.map(e => ({
          type: e.type,
          amount: e.type === 'Stake' ? e.amount : -Math.abs(e.amount),
          date: e.eventDate,
          status: e.status
        }));
        // Map reward claims
        const rewardTxs: TransactionHistoryItem[] = claimHistory.map(c => ({
          type: 'Reward',
          amount: c.convertedAmount,
          date: c.claimedAt,
          status: 'completed'
        }));
        // Merge and sort by date desc
        this.transactionHistory = [...stakeTxs, ...rewardTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      });
    });
  }

  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const connectedWalletAddress =
        this.tonConnectService.getCurrentWalletAddress();
      if (!connectedWalletAddress) {
        this.walletInfo = undefined;
        reject(new Error('dashboard: No connected wallet address'));
        return;
      }
      this.walletService
        .getWalletInfo(connectedWalletAddress)
        .subscribe((info) => {
          this.walletInfo = info;
          resolve();
        });
    });
  }

  calculateDaysStaked() {
    if (!this.walletInfo?.joinedAt) {
      this.daysStaked = 0;
      this.progressPercent = 0;
      return;
    }
    // Use UTC and include today
    const joined = new Date(this.walletInfo.joinedAt);
    const now = new Date();
    const utc1 = Date.UTC(
      joined.getFullYear(),
      joined.getMonth(),
      joined.getDate()
    );
    const utc2 = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1;
    this.daysStaked = Math.max(diff, 0);
    this.progressPercent = Math.min(
      (this.daysStaked / this.targetDays) * 100,
      100
    );
  }

  getTotalRewardEarned() {
    if (!this.walletInfo?.walletAddress) return;
    this.tasksService
      .getTotalRewardEarned(this.walletInfo.walletAddress)
      .subscribe((total) => {
        this.totalRewardEarned = total;
      });
  }

  getClaimHistory() {
    if (!this.walletInfo?.walletAddress) return;
    this.tasksService
      .getClaimHistory(this.walletInfo.walletAddress)
      .subscribe((claimHistory: ClaimHistoryItem[]) => {
        this.totalClaims = claimHistory.length;
        if (claimHistory.length > 0) {
          // Find the latest claimedAt date
          this.lastClaimedAt = claimHistory
            .map((h) => h.claimedAt)
            .sort()
            .reverse()[0];
        } else {
          this.lastClaimedAt = undefined;
        }
      });
  }
}
