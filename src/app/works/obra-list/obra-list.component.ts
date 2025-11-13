import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObraService } from '../../shared/obra.service';
import { ObraListagemDto, ObraStatus } from '../../shared/models/obra.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-obra-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './obra-list.component.html',
  styleUrls: ['./obra-list.component.scss']
})
export class ObraListComponent implements OnInit {
  obras: ObraListagemDto[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private obraService: ObraService) { }

  ngOnInit(): void {
    this.loadObras();
  }

  loadObras(): void {
    this.loading = true;
    this.obraService.getObras().subscribe({
      next: (data) => {
        this.obras = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load works.';
        this.loading = false;
        console.error('Error loading obras:', err);
      }
    });
  }

  getStatusName(status: ObraStatus | undefined): string {
    switch (status) {
      case ObraStatus.EmAndamento: return 'Em Andamento';
      case ObraStatus.EmManutencao: return 'Em Manutenção';
      case ObraStatus.Suspensa: return 'Suspensa';
      case ObraStatus.Finalizada: return 'Finalizada';
      default: return 'Desconhecido';
    }
  }
}