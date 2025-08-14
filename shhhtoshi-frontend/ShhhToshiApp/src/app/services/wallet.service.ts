import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletService {
  baseUrl = 'https://localhost:7069/api/wallet';
  constructor(private readonly http: HttpClient) {}

  setWalletAddress(walletAddress: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/connect`, {}, { headers });
  }

  getWalletInfo(walletAddress: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/walletInfo?walletAddress=${walletAddress}`
    );
  }

  stake(walletAddress: string, stakeAmount: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/stake`, stakeAmount, { headers });
  }

  unstake(walletAddress: string, unStakeAmount: number): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/unstake`, unStakeAmount, {
      headers,
    });
  }

  claimRewards(walletAddress: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/claim`, {}, { headers });
  }
}
