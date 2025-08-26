export interface TaskItem {
  id: string;
  title: string;
  description: string;
  points: number;
  isActive: boolean;
}

export interface TaskCompleteDto {
  taskId: string;
}

export interface TaskCompleteHistoryDto {
  id: string;
  walletAddress: string;
  taskId: string;
  completedAt: string;
}

export interface PointsInfo {
  points: number;
  conversionRate: number;
}

export interface PointClaimResponse {
  convertedAmount: number;
}

export interface ClaimHistoryItem {
  id: string;
  pointsClaimed: number;
  convertedAmount: number;
  claimedAt: string;
}
