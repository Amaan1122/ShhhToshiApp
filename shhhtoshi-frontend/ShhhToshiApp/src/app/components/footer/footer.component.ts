import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  House,
  Wallet,
  Settings,
  Gift,
  Users
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  Home = House;
  Wallet = Wallet;
  Settings = Settings;
  Users = Users;
  Gift = Gift;
}
