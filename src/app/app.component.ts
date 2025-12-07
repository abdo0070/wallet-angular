import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";
import { GoalSettingComponent } from "./components/goal-setting/goal-setting.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, DashboardHeaderComponent, GoalSettingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wallet';
}
