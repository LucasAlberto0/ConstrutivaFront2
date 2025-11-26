import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentoService } from '../../../shared/documento.service';
import { DocumentoListagemDto, DocumentoCriacaoDto } from '../../../shared/models/documento.model';
import { TipoPasta } from '../../../shared/models/obra.model';
import { AuthService } from '../../../shared/auth.service'; // Added import

@Component({
  selector: 'app-documento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documento-list.component.html',
  styleUrls: ['./documento-list.component.scss']
})
export class DocumentoListComponent implements OnInit {
  @Input() obraId!: number;
  @Input() documentos: DocumentoListagemDto[] = [];
  @Output() documentoAdded = new EventEmitter<void>();
  @Output() documentoDeleted = new EventEmitter<void>();

  newDocumento: DocumentoCriacaoDto = {
    nomeArquivo: '',
    url: '',
    pasta: TipoPasta.Outros,
    obraId: 0
  };
  loading: boolean = false;
  error: string | null = null;
  tipoPastaOptions = Object.values(TipoPasta).filter(value => typeof value === 'number');
  canManageDocumentos: boolean = false; // Added property

  constructor(private documentoService: DocumentoService, private authService: AuthService) { } // Injected AuthService

  ngOnInit(): void {
    this.newDocumento.obraId = this.obraId;
    this.canManageDocumentos = this.authService.hasRole(['Admin', 'Coordenador']); // Initialize canManageDocumentos
  }

  addDocumento(): void {
    if (!this.newDocumento.nomeArquivo || !this.newDocumento.url) {
      this.error = 'Nome do arquivo e URL são obrigatórios.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.documentoService.createDocumento(this.obraId, this.newDocumento).subscribe({
      next: () => {
        this.newDocumento = {
          nomeArquivo: '',
          url: '',
          pasta: TipoPasta.Outros,
          obraId: this.obraId
        };
        this.documentoAdded.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar documento.';
        this.loading = false;
        console.error('Erro ao adicionar documento:', err);
      }
    });
  }

  deleteDocumento(documentoId: number | undefined): void {
    if (!documentoId || !confirm('Tem certeza que deseja excluir este documento?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.documentoService.deleteDocumento(this.obraId, documentoId).subscribe({
      next: () => {
        this.documentoDeleted.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir documento.';
        this.loading = false;
        console.error('Erro ao excluir documento:', err);
      }
    });
  }

  getPastaName(pasta: TipoPasta | undefined): string {
    switch (pasta) {
      case TipoPasta.Contratos: return 'Contratos';
      case TipoPasta.Projetos: return 'Projetos';
      case TipoPasta.Relatorios: return 'Relatórios';
      case TipoPasta.Outros: return 'Outros';
      default: return 'Desconhecido';
    }
  }
}