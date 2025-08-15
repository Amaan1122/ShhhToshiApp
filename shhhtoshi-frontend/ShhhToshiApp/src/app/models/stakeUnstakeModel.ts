import { Injectable, signal, computed } from '@angular/core';

export interface StakingDetail {
  estimated?: string;
  amount: string;
}

@Injectable({ providedIn: 'root' })
export class StakeUnstakeModel {
  // Raw state signals
  readonly isStakeTabActive = signal(true);
  readonly isWalletConnected = signal(false);
  readonly amount = signal('');
  readonly unstakeOption = signal<'unstake' | 'swap'>('unstake');
  readonly stakingInProgress = signal<StakingDetail[]>([]);
  readonly unstakingInProgress = signal<StakingDetail | null>(null);

  // Internal balances
  private readonly _tonBalance = signal(0);
  private readonly _htonBalance = signal(0);

  // Computed / derived
  readonly tonBalanceFormatted = computed(
    () => this._tonBalance().toFixed(2) + ' TON'
  );

  readonly htonBalanceFormatted = computed(
    () => this._htonBalance().toFixed(2) + ' hTON'
  );

  readonly isAmountValid = computed(() => {
    const val = parseFloat(this.amount().replace(',', '.'));
    return !isNaN(val) && val > 0 && val <= this._tonBalance();
  });

  readonly isButtonEnabled = computed(() => {
    if (!this.isWalletConnected()) return true;
    if (this.isStakeTabActive()) {
      return this.isAmountValid();
    }
    return (
      this.isAmountValid() &&
      (this.unstakeOption() === 'swap' || this.unstakeOption() === 'unstake')
    );
  });

  readonly buttonLabel = computed(() => {
    if (!this.isWalletConnected()) return 'Connect Wallet';
    if (this.isStakeTabActive()) return 'Stake';
    return this.unstakeOption() === 'swap' ? 'Swap now' : 'Unstake';
  });

  readonly youWillReceive = computed(() => {
    const amt = parseFloat(this.amount().replace(',', '.')) || 0;
    const rate = this.exchangeRateRaw();
    return (amt * rate).toFixed(2);
  });

  readonly exchangeRateRaw = signal(0.95);
  readonly exchangeRateFormatted = computed(
    () => this.exchangeRateRaw().toFixed(4) + ' TON/hTON'
  );

  readonly averageStakeFeeFormatted = computed(() => '0.01 TON');
  readonly averageUnstakeFeeFormatted = computed(() => '0.015 TON');

  readonly swapUrl = computed(
    () => `https://swap.example.com?amount=${encodeURIComponent(this.amount())}`
  );

  // Public API
  setActiveTab(tab: 'stake' | 'unstake'): void {
    this.isStakeTabActive.set(tab === 'stake');
    this.amount.set('');
    this.unstakeOption.set('unstake');
  }

  setAmount(value: string): void {
    this.amount.set(value);
  }

  setAmountToMax(): void {
    this.amount.set(this._tonBalance().toString());
  }

  setUnstakeOption(option: 'unstake' | 'swap'): void {
    this.unstakeOption.set(option);
  }

  async connect(): Promise<void> {
    // TODO: call your TON wallet SDK
    this.isWalletConnected.set(true);

    // stub balances/details
    this._tonBalance.set(123.45);
    this._htonBalance.set(67.89);
    this.stakingInProgress.set([{ amount: '10', estimated: '2025-08-20' }]);
    this.unstakingInProgress.set({ amount: '5', estimated: '2025-08-22' });
  }

  async send(): Promise<void> {
    // TODO: stake or unstake on chain
    if (this.isStakeTabActive()) {
      // await contract.stake(this.amount())
    } else if (this.unstakeOption() === 'unstake') {
      // await contract.unstake(this.amount())
    }
    await this.refreshBalances();
  }

  private async refreshBalances(): Promise<void> {
    // TODO: fetch and update balances
    this._tonBalance.set(this._tonBalance());
    this._htonBalance.set(this._htonBalance());
  }
}
