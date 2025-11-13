import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiarioService } from '../../../shared/diario.service';
import { DiarioObraListagemDto, DiarioObraCriacaoDto, ComentarioCriacaoDto } from '../../../shared/models/diario.model';
import { FotoDiarioDto } from '../../../shared/models/foto-diario.model';
import { ComentarioDto } from '../../../shared/models/comentario.model';

@Component({
  selector: 'app-diario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diario-list.component.html',
  styleUrls: ['./diario-list.component.scss']
})
export class DiarioListComponent implements OnInit {
  @Input() obraId!: number;
  @Input() diarios: DiarioObraListagemDto[] = [];
  @Output() diarioAdded = new EventEmitter<void>();
  @Output() diarioDeleted = new EventEmitter<void>();

  newDiario: DiarioObraCriacaoDto = {
    data: new Date().toISOString(),
    clima: '',
    colaboradores: '',
    atividades: '',
    obraId: 0,
    fotosUrls: [],
    comentarios: []
  };
  newFotoUrl: string = '';
  newComentarioTexto: string = '';
  currentDiarioDetalhes: any = null; // To store details of a selected diario
  loading: boolean = false;
  error: string | null = null;

  constructor(private diarioService: DiarioService) { }

  ngOnInit(): void {
    this.newDiario.obraId = this.obraId;
  }

  addDiario(): void {
    if (!this.newDiario.data) {
      this.error = 'Data é obrigatória para o diário.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.diarioService.createDiario(this.obraId, this.newDiario).subscribe({
      next: () => {
        this.newDiario = {
          data: new Date().toISOString(),
          clima: '',
          colaboradores: '',
          atividades: '',
          obraId: this.obraId,
          fotosUrls: [],
          comentarios: []
        };
        this.diarioAdded.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar diário de obra.';
        this.loading = false;
        console.error('Erro ao adicionar diário:', err);
      }
    });
  }

  deleteDiario(diarioId: number | undefined): void {
    if (!diarioId || !confirm('Tem certeza que deseja excluir este diário de obra?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.diarioService.deleteDiario(this.obraId, diarioId).subscribe({
      next: () => {
        this.diarioDeleted.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir diário de obra.';
        this.loading = false;
        console.error('Erro ao excluir diário:', err);
      }
    });
  }

  viewDiarioDetails(diarioId: number | undefined): void {
    if (!diarioId) return;

    this.loading = true;
    this.error = null;
    this.diarioService.getDiarioById(this.obraId, diarioId).subscribe({
      next: (details) => {
        this.currentDiarioDetalhes = details;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar detalhes do diário.';
        this.loading = false;
        console.error('Erro ao carregar detalhes do diário:', err);
      }
    });
  }

  closeDiarioDetails(): void {
    this.currentDiarioDetalhes = null;
  }

  addFoto(diarioId: number | undefined): void {
    if (!diarioId || !this.newFotoUrl) {
      this.error = 'URL da foto é obrigatória.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.diarioService.addFotoToDiario(this.obraId, diarioId, this.newFotoUrl).subscribe({
      next: () => {
        this.newFotoUrl = '';
        this.viewDiarioDetails(diarioId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar foto.';
        this.loading = false;
        console.error('Erro ao adicionar foto:', err);
      }
    });
  }

  deleteFoto(diarioId: number | undefined, fotoId: number | undefined): void {
    if (!diarioId || !fotoId || !confirm('Tem certeza que deseja excluir esta foto?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.diarioService.deleteFotoFromDiario(this.obraId, diarioId, fotoId).subscribe({
      next: () => {
        this.viewDiarioDetails(diarioId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir foto.';
        this.loading = false;
        console.error('Erro ao excluir foto:', err);
      }
    });
  }

  addComentario(diarioId: number | undefined): void {
    if (!diarioId || !this.newComentarioTexto) {
      this.error = 'Comentário é obrigatório.';
      return;
    }

    // Assuming a dummy autorId for now, replace with actual user ID
    const comentario: ComentarioCriacaoDto = {
      texto: this.newComentarioTexto,
      autorId: 'dummy-user-id'
    };

    this.loading = true;
    this.error = null;
    this.diarioService.addComentarioToDiario(this.obraId, diarioId, comentario).subscribe({
      next: () => {
        this.newComentarioTexto = '';
        this.viewDiarioDetails(diarioId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar comentário.';
        this.loading = false;
        console.error('Erro ao adicionar comentário:', err);
      }
    });
  }

  deleteComentario(diarioId: number | undefined, comentarioId: number | undefined): void {
    if (!diarioId || !comentarioId || !confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.diarioService.deleteComentarioFromDiario(this.obraId, diarioId, comentarioId).subscribe({
      next: () => {
        this.viewDiarioDetails(diarioId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir comentário.';
        this.loading = false;
        console.error('Erro ao excluir comentário:', err);
      }
    });
  }
}