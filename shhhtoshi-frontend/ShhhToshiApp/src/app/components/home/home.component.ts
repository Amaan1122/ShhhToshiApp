import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { TonConnectService } from '../../services/ton-connect.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly tonConnectService: TonConnectService,
    private readonly route: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.tonConnectService.walletConnected$.subscribe((connected) => {
      if (connected) {
        const returnUrl =
          this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
          '/stake';
        this.route.navigateByUrl(returnUrl);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tonConnectService.initialize();
  }
}
