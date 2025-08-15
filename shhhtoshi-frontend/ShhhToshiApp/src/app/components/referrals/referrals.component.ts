import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-referrals',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './referrals.component.html',
  styleUrl: './referrals.component.css'
})
export class ReferralsComponent {

}
