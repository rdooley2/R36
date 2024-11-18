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
    this.loadD3Chart();
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

  private loadD3Chart(): void {
    const token = localStorage.getItem('jwt');
    this.http.get<ChartData[]>('http://localhost:3000/getChartData', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      () => {
        const chartData: ChartData[] = [
          { title: "January", value: 4782, color: "#FF6F61" },
          { title: "February", value: 5417, color: "#6FA3EF" },
          { title: "March", value: 7131, color: "#FFD93D" },
          { title: "April", value: 7909, color: "#6BBE45" },
          { title: "May", value: 8592, color: "#FF9A00" },
          { title: "June", value: 8618, color: "#9B59B6" },
          { title: "July", value: 8827, color: "#E74C3C" },
        ];

        const width = 960;
        const height = 450;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select("#myChart2")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie<ChartData>()
            .value(d => d.value)
            .sort(null);

        const arc = d3.arc<d3.PieArcDatum<ChartData>>()
            .outerRadius(radius * 0.8)
            .innerRadius(radius * 0.4);

        const outerArc = d3.arc<d3.PieArcDatum<ChartData>>()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const color = d3.scaleOrdinal<string>()
            .domain(chartData.map(d => d.title))
            .range(chartData.map(d => d.color));

        const slices = svg.selectAll("path.slice")
            .data(pie(chartData))
            .enter()
            .append("path")
            .attr("class", "slice")
            .attr("d", arc)
            .style("fill", d => color(d.data.title));

        const text = svg.selectAll("text")
            .data(pie(chartData))
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .text(d => d.data.title)
            .attr("transform", function (d) {
                const pos = outerArc.centroid(d);
                pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);
                return `translate(${pos})`;
            })
            .style("text-anchor", d => midAngle(d) < Math.PI ? "start" : "end");

        svg.selectAll("polyline")
            .data(pie(chartData))
            .enter()
            .append("polyline")
            .attr("points", function (d) {
                const pos = outerArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return [arc.centroid(d), outerArc.centroid(d), pos]
                    .map(p => p.join(",")).join(" ");
            })
            .style("stroke", "black")
            .style("fill", "none")
            .style("stroke-width", 1.5);

        function midAngle(d: d3.PieArcDatum<ChartData>) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
}


}
