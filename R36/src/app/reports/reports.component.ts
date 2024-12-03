import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

interface ChartData {
  title: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})

export class ReportsComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {
    this.checkToken();
  }

  ngOnInit(): void {
    this.loadBarGraph();
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

  private loadBarGraph(): void {
    const token = localStorage.getItem('jwt');
    this.http.get<{ summary: ChartData[], reports: ChartData[] }>('http://localhost:3000/getChartData', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        const chartData = response.reports;

        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 960 - margin.left - margin.right;
        const height = 450 - margin.top - margin.bottom;

        const svg = d3.select("#myChart2")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleBand()
            .domain(chartData.map(d => d.title))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.value) as number])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.title) as number)
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => d.color);
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
  }




}
