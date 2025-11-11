import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-panel',
  imports: [BaseChartDirective],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent {

    // --- BARRAS ---
  barType: ChartType = 'bar';
  barData: ChartConfiguration['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      { label: 'Ventas', data: [120, 150, 180, 90, 130, 170, 210] },
      { label: 'Costos', data: [80, 100, 110, 70, 95, 120, 140] },
    ],
  };
  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } },
  };

  // --- TORTA (pie) ---
  pieType: ChartType = 'pie';
  pieData: ChartConfiguration['data'] = {
    labels: ['Docentes', 'Estudiantes', 'Acudientes'],
    datasets: [{ label: 'Cantidad', data: [35, 25, 15] }],
  };
  pieOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
  };

  // --- LÍNEA ---
  lineType: ChartType = 'line';
  lineData: ChartConfiguration['data'] = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
    datasets: [
      {
        label: 'Usuarios activos',
        data: [45, 60, 52, 70, 68, 80],
        fill: true,
        tension: 0.3,
      },
    ],
  };
  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  };
}
