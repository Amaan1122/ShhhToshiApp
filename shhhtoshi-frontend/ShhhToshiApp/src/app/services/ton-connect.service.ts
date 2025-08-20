import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  TonConnectUI,
  TonConnectUiCreateOptions,
  Wallet,
} from '@tonconnect/ui';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TonConnectService {
  private tonConnectUI: TonConnectUI | null = null;

  private readonly walletAddressSubject = new BehaviorSubject<string>('');
  private readonly walletConnectedSubject = new BehaviorSubject<boolean>(false);
  private readonly walletDataSubject = new BehaviorSubject<Wallet | null>(null);

  walletAddress$: Observable<string> = this.walletAddressSubject.asObservable();
  walletConnected$: Observable<boolean> =
    this.walletConnectedSubject.asObservable();
  walletData$: Observable<Wallet | null> =
    this.walletDataSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: Object) {}

  initialize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.tonConnectUI) return; // Prevent reinitialization

    const options: TonConnectUiCreateOptions = {
      manifestUrl:
        'https://shhh-toshi-test-app.vercel.app/assets/tonconnect-manifest.json',
      buttonRootId: 'ton-connect-button',
    };

    this.tonConnectUI = new TonConnectUI(options);
    console.log('✅ TonConnect UI initialized');

    this.listenToWalletStatus();
    this.restoreWalletState();
  }

  getTonConnectUI(): TonConnectUI | null {
    return this.tonConnectUI;
  }

  getCurrentWalletAddress(): string {
    return this.walletAddressSubject.value;
  }
  isWalletConnected(): boolean {
    return this.walletConnectedSubject.value;
  }

  getWalletInfo(): Wallet | null {
    return this.walletDataSubject.value;
  }

  async disconnect(): Promise<void> {
    if (this.tonConnectUI) await this.tonConnectUI.disconnect();
  }

  async sendTransaction(tx: any): Promise<any> {
    if (!this.tonConnectUI || !this.isWalletConnected()) {
      throw new Error('Wallet not connected or UI not initialized');
    }
    return await this.tonConnectUI.sendTransaction(tx);
  }

  private listenToWalletStatus(): void {
    this.tonConnectUI?.onStatusChange((wallet) => {
      wallet?.account?.address ? this.setWallet(wallet) : this.clearWallet();
    });
  }

  private setWallet(wallet: Wallet): void {
    const address = wallet.account.address;
    this.walletAddressSubject.next(address);
    this.walletConnectedSubject.next(true);
    this.walletDataSubject.next(wallet);

    localStorage.setItem('walletAddress', address);
    localStorage.setItem('walletConnected', 'true');
    console.log('✅ Wallet connected:', address);
  }

  private clearWallet(): void {
    this.walletAddressSubject.next('');
    this.walletConnectedSubject.next(false);
    this.walletDataSubject.next(null);

    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletConnected');
    console.log('🔌 Wallet disconnected');
  }

  private restoreWalletState(): void {
    const address = localStorage.getItem('walletAddress');
    const connected = localStorage.getItem('walletConnected') === 'true';

    if (address && connected && this.tonConnectUI?.wallet) {
      const wallet = this.tonConnectUI.wallet;
      this.setWallet(wallet);
    }
  }
}
