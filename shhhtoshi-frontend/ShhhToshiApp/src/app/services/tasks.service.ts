import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TaskCompleteDto,
  TaskItem,
  ClaimHistoryItem,
  PointClaimResponse,
  PointsInfo,
  TaskCompleteHistoryDto,
} from '../models/TasksModel';

@Injectable({ providedIn: 'root' })
export class TasksService {
  // For Production
  // baseUrl = 'https://shhhtoshiapi.azurewebsites.net/api';

  // For Local Development
  private readonly baseUrl = 'https://localhost:7069/api';
  constructor(private readonly http: HttpClient) {}

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.baseUrl}/tasks`);
  }

  completeTask(walletAddress: string, dto: TaskCompleteDto): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(`${this.baseUrl}/tasks/complete`, dto, { headers });
  }

  getCompletedTask(
    walletAddress: string
  ): Observable<TaskCompleteHistoryDto[]> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.get<TaskCompleteHistoryDto[]>(
      `${this.baseUrl}/tasks/completedTasks`,
      { headers }
    );
  }

  claimPoints(walletAddress: string): Observable<PointClaimResponse> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post<PointClaimResponse>(
      `${this.baseUrl}/points/claim`,
      {},
      { headers }
    );
  }

  getPoints(walletAddress: string): Observable<PointsInfo> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.get<PointsInfo>(`${this.baseUrl}/points`, { headers });
  }

  getClaimHistory(walletAddress: string): Observable<ClaimHistoryItem[]> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.get<ClaimHistoryItem[]>(
      `${this.baseUrl}/points/claimHistory`,
      {
        headers,
      }
    );
  }

  dailyCheckin(walletAddress: string): Observable<any> {
    const headers = new HttpHeaders().set('X-Wallet-Address', walletAddress);
    return this.http.post(
      `${this.baseUrl}/tasks/daily-checkin`,
      {},
      { headers }
    );
  }
}
