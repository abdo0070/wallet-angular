import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent {

  constructor(
    public sharedService: SharedService,
    private router: Router
  ) { }

  get userName(): string {
    return this.sharedService.userName;
  }

  logout() {
    this.sharedService.clearUser();
    this.router.navigate(['/login']);
  }
}
