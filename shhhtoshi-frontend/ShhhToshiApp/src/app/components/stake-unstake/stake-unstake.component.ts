import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StakeUnstakeModel } from '../../models/stakeUnstakeModel';
import { FooterComponent } from '../footer/footer.component';
import { StakeUnstakeService } from '../../services/stake-unstake.service';
import { TonConnectService } from '../../services/ton-connect.service';
import { Router } from '@angular/router';
import { WalletService } from '../../services/wallet.service';
import { HeaderComponent } from '../header/header.component';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-stake-unstake',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './stake-unstake.component.html',
  styleUrl: './stake-unstake.component.css',
})
export class StakeUnstakeComponent {
  walletAddress = '';
  walletBalance = 0;
  walletPoints = 0;
  stakedAmount = 0;
  stakeAmount = 0;
  unstakeAmount = 0;

  @Input({ required: true }) model!: StakeUnstakeModel;

  constructor(
    private readonly walletService: WalletService,
    private readonly stakeUnstakeService: StakeUnstakeService,
    private readonly tasksService: TasksService,
    private readonly tonConnectService: TonConnectService,
    private readonly route: Router,
    private readonly cdr: ChangeDetectorRef
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
        this.walletAddress = info.walletAddress;
        this.walletBalance = info.tonBalance;
        this.stakedAmount = info.stakedAmount;
        this.walletPoints = info.points;
        this.cdr.markForCheck();
      });
  }

  stakeNow() {
    this.stakeUnstakeService
      .stake(this.walletAddress, this.model.amount())
      .subscribe({
        next: () => this.ngOnInit(),
        error: (err) => console.error('Error staking:', err),
      });
  }

  unstakeNow() {
    this.stakeUnstakeService
      .unstake(this.walletAddress, this.model.amount())
      .subscribe({
        next: () => this.ngOnInit(),
        error: (err) => console.error('Error unstaking:', err),
      });
  }

  claimRewards() {
    this.tasksService.claimPoints(this.walletAddress).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => console.error('Error claiming rewards:', err),
    });
  }

  disconnectWallet() {
    this.tonConnectService.disconnect();
    this.route.navigate(['home']);
  }
}
