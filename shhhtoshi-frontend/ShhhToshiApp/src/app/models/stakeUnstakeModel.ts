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
  readonly amount = signal(0);
  readonly unstakeOption = signal<'unstake' | 'swap'>('unstake');

  // Internal balances
  private readonly _tonBalance = signal(0);
  private readonly _shTokenBalance = signal(0);

  // Computed / derived
  readonly tonBalanceFormatted = computed(
    () => this._tonBalance().toFixed(2) + ' TON'
  );

  readonly shTokenBalanceFormatted = computed(
    () => this._shTokenBalance().toFixed(2) + ' SHToken'
  );

  readonly isAmountValid = computed(() => {
    const val = this.amount();
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
    const amt = this.amount();
    const rate = this.exchangeRateRaw();
    return (amt * rate).toFixed(2);
  });

  readonly exchangeRateRaw = signal(0.95);
  readonly exchangeRateFormatted = computed(
    () => this.exchangeRateRaw().toFixed(4) + ' TON/SHToken'
  );

  readonly swapUrl = computed(
    () => `https://swap.example.com?amount=${encodeURIComponent(this.amount())}`
  );

  // Public API
  setActiveTab(tab: 'stake' | 'unstake'): void {
    this.isStakeTabActive.set(tab === 'stake');
    this.amount.set(0);
    this.unstakeOption.set('unstake');
  }

  setAmount(value: number): void {
    this.amount.set(value);
  }
  
  setUnstakeOption(option: 'unstake' | 'swap'): void {
    this.unstakeOption.set(option);
  }

  async connect(): Promise<void> {
    // TODO: call your TON wallet SDK
    this.isWalletConnected.set(true);
  }
}
