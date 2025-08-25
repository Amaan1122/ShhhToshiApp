import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { TonConnectService } from '../../services/ton-connect.service';
import {
  TaskItem,
  PointsInfo,
  ClaimHistoryItem,
} from '../../models/TasksModel';
import { firstValueFrom } from 'rxjs';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent implements OnInit {
  pointsInfo: PointsInfo | null = null;
  tasks: TaskItem[] = [];
  completedTaskIds: Set<string> = new Set();
  completedTaskNames: string[] = [];
  claimHistory: ClaimHistoryItem[] = [];
  walletAddress: string = '';
  isLoading = true;
  isClaiming = false;

  constructor(
    private readonly tonConnectService: TonConnectService,
    private readonly tasksService: TasksService
  ) {}

  ngOnInit() {
    this.walletAddress = this.tonConnectService.getCurrentWalletAddress();
    console.log('Wallet Address:', this.walletAddress);
    this.loadAll();
  }
  loadAll() {
    this.isLoading = true;
    Promise.all([
      firstValueFrom(this.tasksService.getPoints(this.walletAddress)),
      firstValueFrom(this.tasksService.getTasks()),
      firstValueFrom(this.tasksService.getClaimHistory(this.walletAddress)),
      firstValueFrom(this.tasksService.getCompletedTask(this.walletAddress)),
    ])
      .then(([points, tasks, history, completedTasks]) => {
        this.pointsInfo = points!;
        this.tasks = tasks!;
        this.claimHistory = history!;
        this.completedTaskIds = new Set(
          completedTasks.map((task) => task.taskId)
        );
        this.completedTaskNames = tasks.map((task) => task.title);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  onClaimPoints() {
    if (!this.walletAddress) return;
    this.isClaiming = true;
    this.tasksService.claimPoints(this.walletAddress).subscribe({
      next: () => this.loadAll(),
      complete: () => (this.isClaiming = false),
      error: () => (this.isClaiming = false),
    });
  }

  // Add more methods for task completion, etc. as needed
}
