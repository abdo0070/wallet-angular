import { Component } from '@angular/core';
import { DashboardHeaderComponent } from "../dashboard-header/dashboard-header.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
