import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManutencaoService } from '../../../shared/manutencao.service';
import { ManutencaoListagemDto, ManutencaoCriacaoDto } from '../../../shared/models/manutencao.model';
import { AuthService } from '../../../shared/auth.service'; // Added import

@Component({
  selector: 'app-manutencao-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manutencao-list.component.html',
  styleUrls: ['./manutencao-list.component.scss']
})
export class ManutencaoListComponent implements OnInit {
  @Input() obraId!: number;
  @Input() manutencoes: ManutencaoListagemDto[] = [];
  @Output() manutencaoAdded = new EventEmitter<void>();
  @Output() manutencaoDeleted = new EventEmitter<void>();

  newManutencao: ManutencaoCriacaoDto = {
    dataInicio: new Date().toISOString(),
    dataTermino: new Date().toISOString(),
    imagemUrl: '',
    datasManutencao: '',
    obraId: 0
  };
  loading: boolean = false;
  error: string | null = null;
  canManageManutencoes: boolean = false; // Added property

  constructor(private manutencaoService: ManutencaoService, private authService: AuthService) { } // Injected AuthService

  ngOnInit(): void {
    this.newManutencao.obraId = this.obraId;
    this.canManageManutencoes = this.authService.hasRole(['Admin', 'Coordenador']); // Initialize canManageManutencoes
  }

  addManutencao(): void {
    if (!this.newManutencao.dataInicio || !this.newManutencao.dataTermino) {
      this.error = 'Data de início e término são obrigatórias.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.manutencaoService.createManutencao(this.obraId, this.newManutencao).subscribe({
      next: () => {
        this.newManutencao = {
          dataInicio: new Date().toISOString(),
          dataTermino: new Date().toISOString(),
          imagemUrl: '',
          datasManutencao: '',
          obraId: this.obraId
        };
        this.manutencaoAdded.emit(); // Notify parent to refresh manutencoes
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar manutenção.';
        this.loading = false;
        console.error('Erro ao adicionar manutenção:', err);
      }
    });
  }

  deleteManutencao(manutencaoId: number | undefined): void {
    if (!manutencaoId || !confirm('Tem certeza que deseja excluir esta manutenção?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.manutencaoService.deleteManutencao(this.obraId, manutencaoId).subscribe({
      next: () => {
        this.manutencaoDeleted.emit(); // Notify parent to refresh manutencoes
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir manutenção.';
        this.loading = false;
        console.error('Erro ao excluir manutenção:', err);
      }
    });
  }
}