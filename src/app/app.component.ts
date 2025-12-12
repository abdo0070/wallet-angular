import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { DashboardHeaderComponent } from "./components/dashboard-header/dashboard-header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Wallet';
  showShell = false;

  constructor(private router: Router) {
    this.updateShellVisibility(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateShellVisibility(event.urlAfterRedirects);
      }
    });
  }

  private updateShellVisibility(url: string) {
    this.showShell = !(url.startsWith('/login') || url.startsWith('/register'));
  }
}
