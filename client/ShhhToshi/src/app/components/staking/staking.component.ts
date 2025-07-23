import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-staking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './staking.component.html',
  styleUrl: './staking.component.scss',
})
export class StakingComponent {
  balance = signal<number>(500); // Simulated user balance
  rewardRatePerToken = 0.1; // 10% reward for example
  penaltyPerToken = 0.2; // 20% reward for example
  reward = signal<number>(0);
  penalty = signal<number>(0);
  stakedAmount: number = 0;

  stakeForm: FormGroup;
  unStakeForm: FormGroup;

  days: any[] = [{ value: '7' }, { value: '15' }, { value: '30' }];

  constructor(private readonly fb: FormBuilder) {
    this.stakeForm = this.fb.group({
      stakeAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      period: new FormControl('', [Validators.required]),
    });

    this.unStakeForm = this.fb.group({
      unStakeAmount: new FormControl('', [Validators.required, Validators.min(1)])
    });

    this.stakeForm.get('period')?.valueChanges.subscribe((value) => {
      this.updateReward(value);
    });

    this.unStakeForm.get('unStakeAmount')?.valueChanges.subscribe((value) => {
      this.updateLoss(value);
    });
  }

  updateReward(value: number) {
    const num = Number(value);
    this.reward.set(num > 0 ? num * this.rewardRatePerToken : 0);
  }

  updateLoss(value: number) {
    const num = Number(value);
    this.penalty.set(num > 0 ? num * this.penaltyPerToken : 0);
  }

  stake() {
    if (this.stakeForm.invalid) return;

    const amount = this.stakeForm.value.stakeAmount;
    const period = this.stakeForm.value.period;

    this.stakedAmount = amount;

    console.log(`Staking ${amount} tokens...`);
    console.log(`Staking for ${period} days...`);
    // Call your backend API here
  }

  unStake() {
    if (this.unStakeForm.invalid) return;

    if(this.unStakeForm.value.unStakeAmount > this.stakedAmount) {
      alert("No enough balance to unstake");
      return;
    }
    const unStakeAmount = this.unStakeForm.value.unStakeAmount;
    this.stakedAmount -= unStakeAmount;
    console.log(`Un Staking ${unStakeAmount} tokens...`);
  }
}
