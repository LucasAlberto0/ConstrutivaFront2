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
  filteredObras: ObraListagemDto[] = [];
  loading: boolean = true;
  error: string | null = null;
  currentFilter: string = 'Todas';

  constructor(private obraService: ObraService) { }

  ngOnInit(): void {
    this.loadObras();
  }

  loadObras(): void {
    this.loading = true;
    this.obraService.getObras().subscribe({
      next: (response: any) => {
        if (response && Array.isArray(response.data)) {
          this.obras = response.data;
          this.filteredObras = [...this.obras];
          this.filterObras('Todas');
        } else {
          console.error('Error: getObras() did not return an array in the data property.', response);
          this.obras = [];
          this.filteredObras = [];
          this.error = 'Failed to load works: Invalid data format.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load works.';
        this.loading = false;
        console.error('Error loading obras:', err);
      }
    });
  }

  filterObras(filter: string): void {
    this.currentFilter = filter;
    if (filter === 'Todas') {
      this.filteredObras = [...this.obras];
    } else {
      this.filteredObras = this.obras.filter(obra => this.getStatusName(obra.status) === filter);
    }
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