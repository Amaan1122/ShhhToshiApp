import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TonConnectService } from './services/ton-connect.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'user-dapp';
  constructor(private readonly tonConnectService: TonConnectService) {}

  ngOnInit(): void {
    // this.tonConnectService.initialize();
  }
}
