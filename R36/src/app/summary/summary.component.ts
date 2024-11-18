import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

interface ChartData {
  title: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})

export class SummaryComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {
    this.checkToken();
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadChart();
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

  private loadChart(): void {
    const token = localStorage.getItem('jwt');
    this.http.get<ChartData[]>('http://localhost:3000/getChartData', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
        const values = [20, 22, 30, 33, 36, 36, 37];
        const colors = ["#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#b15c75"];

        const canvas = <HTMLCanvasElement>document.getElementById('myChart');
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          });
        } else {
          console.error('Canvas context is null');
        }
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
}
}

