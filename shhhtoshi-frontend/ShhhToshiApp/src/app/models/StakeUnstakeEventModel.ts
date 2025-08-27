export interface StakeUnstakeEventModel {
  id: string;
  walletAddress: string;
  type: 'Stake' | 'Unstake';
  amount: number;
  eventDate: string;
  status: 'completed' | 'pending';
}
