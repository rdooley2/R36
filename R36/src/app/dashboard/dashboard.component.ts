import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent {
  constructor(private router: Router) {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/']);
    }
  }
  logout() {
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }
}

