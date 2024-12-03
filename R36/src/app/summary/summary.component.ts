import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

interface ChartData {
  labels: string;
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
    this.loadPieChart();
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

  private loadPieChart(): void {
    const token = localStorage.getItem('jwt');
    this.http.get<{ summary: ChartData[], reports: ChartData[] }>('http://localhost:3000/getChartData', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        const chartData = response.summary; // Use the "summary" data for the chart
        const labels = chartData.map(d => d.labels);
        const values = chartData.map(d => d.value);
        const colors = chartData.map(d => d.color);

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

