import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { DashboardService } from '../shared/dashboard.service';
import { DashboardSummaryDto } from '../shared/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  dashboardSummary: DashboardSummaryDto | null = null;
  loading: boolean = true;
  error: string | null = null;
  statusChart: any = null;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getDashboardSummary();
  }

  ngAfterViewInit(): void {
    this.createStatusChart();
  }

  getDashboardSummary(): void {
    this.loading = true;
    this.dashboardService.getDashboardSummary().subscribe({
      next: (summary) => {
        this.dashboardSummary = summary;
        this.loading = false;
        this.createStatusChart(); 
      },
      error: (err) => {
        this.error = 'Failed to load dashboard summary.';
        this.loading = false;
        console.error('Dashboard summary error:', err);
      }
    });
  }

  createStatusChart(): void {
    if (this.dashboardSummary && !this.statusChart) {
      const canvas = document.getElementById('statusChart') as HTMLCanvasElement;
      if (canvas) {
        this.statusChart = new Chart(canvas, {
          type: 'pie',
          data: {
            labels: ['Em Andamento', 'Em Manutenção', 'Suspensas', 'Finalizadas'],
            datasets: [{
              label: 'Status das Obras',
              data: [
                this.dashboardSummary.obrasEmAndamento || 0,
                this.dashboardSummary.obrasEmManutencao || 0,
                this.dashboardSummary.obrasSuspensas || 0,
                this.dashboardSummary.obrasFinalizadas || 0
              ],
              backgroundColor: [
                '#2463EA',
                '#F59E0B',
                '#EF4444',
                '#10B981'
              ]
            }]
          }
        });
      }
    }
  }

  getStatusName(status: number | undefined): string {
    switch (status) {
      case 0: return 'Em Andamento';
      case 1: return 'Em Manutenção';
      case 2: return 'Suspensa';
      case 3: return 'Finalizada';
      default: return 'Desconhecido';
    }
  }

  getStatusClass(status: number | undefined): string {
    switch (status) {
      case 0: return 'status-andamento';
      case 1: return 'status-manutencao';
      case 2: return 'status-suspensa';
      case 3: return 'status-finalizada';
      default: return '';
    }
  }
}