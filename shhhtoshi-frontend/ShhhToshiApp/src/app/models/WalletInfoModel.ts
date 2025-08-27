export interface WalletInfoModel {
  walletAddress: string;
  tonBalance: number;
  stakedAmount: number;
  lastStakedAt: Date;
  lastUnstakedAt: Date;
  joinedAt: Date;
  points: number;
}
