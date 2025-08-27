import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TonConnectService } from '../../services/ton-connect.service';
import { WalletInfoModel } from '../../models/WalletInfoModel';
import { WalletService } from '../../services/wallet.service';
import { TasksService } from '../../services/tasks.service';
import { ClaimHistoryItem } from '../../models/TasksModel';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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
    private readonly tasksService: TasksService
  ) {}

  ngOnInit() {
    this.initialize().then(() => {
      this.calculateDaysStaked();
      this.getTotalRewardEarned();
      this.getClaimHistory();
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
