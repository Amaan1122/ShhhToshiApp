import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WalletService {
  // For Production
  // baseUrl = 'https://shhhtoshiapi.azurewebsites.net/api/wallet';
  
  // For Local Development
  baseUrl = 'https://localhost:7069/api/wallet';
  constructor(private readonly http: HttpClient) {}

  setWalletUser(walletAddress: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/connect`, {}, { headers });
  }

  getWalletInfo(walletAddress: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/walletInfo?walletAddress=${walletAddress}`
    );
  }
}
