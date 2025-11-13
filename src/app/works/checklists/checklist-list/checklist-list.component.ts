import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChecklistService } from '../../../shared/checklist.service';
import { ChecklistListagemDto, ChecklistCriacaoDto, ChecklistItemCriacaoDto, ChecklistItemAtualizacaoDto } from '../../../shared/models/checklist.model';
import { TipoChecklist } from '../../../shared/models/obra.model';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checklist-list.component.html',
  styleUrls: ['./checklist-list.component.scss']
})
export class ChecklistListComponent implements OnInit {
  @Input() obraId!: number;
  @Input() checklists: ChecklistListagemDto[] = [];
  @Output() checklistAdded = new EventEmitter<void>();
  @Output() checklistDeleted = new EventEmitter<void>();

  newChecklist: ChecklistCriacaoDto = {
    tipo: TipoChecklist.InicioObra,
    obraId: 0,
    itens: []
  };
  newChecklistItemName: string = '';
  loading: boolean = false;
  error: string | null = null;
  tipoChecklistOptions = Object.values(TipoChecklist).filter(value => typeof value === 'number');
  currentChecklistDetalhes: any = null; // To store details of a selected checklist

  constructor(private checklistService: ChecklistService) { }

  ngOnInit(): void {
    this.newChecklist.obraId = this.obraId;
  }

  addChecklist(): void {
    this.loading = true;
    this.error = null;
    this.checklistService.createChecklist(this.obraId, this.newChecklist).subscribe({
      next: () => {
        this.newChecklist = {
          tipo: TipoChecklist.InicioObra,
          obraId: this.obraId,
          itens: []
        };
        this.checklistAdded.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar checklist.';
        this.loading = false;
        console.error('Erro ao adicionar checklist:', err);
      }
    });
  }

  deleteChecklist(checklistId: number | undefined): void {
    if (!checklistId || !confirm('Tem certeza que deseja excluir este checklist?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.checklistService.deleteChecklist(this.obraId, checklistId).subscribe({
      next: () => {
        this.checklistDeleted.emit();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir checklist.';
        this.loading = false;
        console.error('Erro ao excluir checklist:', err);
      }
    });
  }

  viewChecklistDetails(checklistId: number | undefined): void {
    if (!checklistId) return;

    this.loading = true;
    this.error = null;
    this.checklistService.getChecklistById(this.obraId, checklistId).subscribe({
      next: (details) => {
        this.currentChecklistDetalhes = details;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar detalhes do checklist.';
        this.loading = false;
        console.error('Erro ao carregar detalhes do checklist:', err);
      }
    });
  }

  closeChecklistDetails(): void {
    this.currentChecklistDetalhes = null;
  }

  addItem(checklistId: number | undefined): void {
    if (!checklistId || !this.newChecklistItemName) {
      this.error = 'Nome do item é obrigatório.';
      return;
    }

    const item: ChecklistItemCriacaoDto = {
      nome: this.newChecklistItemName,
      concluido: false
    };

    this.loading = true;
    this.error = null;
    this.checklistService.addItemToChecklist(this.obraId, checklistId, item).subscribe({
      next: () => {
        this.newChecklistItemName = '';
        this.viewChecklistDetails(checklistId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao adicionar item ao checklist.';
        this.loading = false;
        console.error('Erro ao adicionar item:', err);
      }
    });
  }

  updateItemStatus(checklistId: number | undefined, item: any): void {
    if (!checklistId || !item.id) return;

    const updatedItem: ChecklistItemAtualizacaoDto = {
      id: item.id,
      nome: item.nome,
      concluido: item.concluido,
      observacao: item.observacao
    };

    this.loading = true;
    this.error = null;
    this.checklistService.updateChecklistItem(this.obraId, checklistId, item.id, updatedItem).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao atualizar item do checklist.';
        this.loading = false;
        console.error('Erro ao atualizar item:', err);
      }
    });
  }

  deleteItem(checklistId: number | undefined, itemId: number | undefined): void {
    if (!checklistId || !itemId || !confirm('Tem certeza que deseja excluir este item do checklist?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.checklistService.deleteChecklistItem(this.obraId, checklistId, itemId).subscribe({
      next: () => {
        this.viewChecklistDetails(checklistId); // Refresh details
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Falha ao excluir item do checklist.';
        this.loading = false;
        console.error('Erro ao excluir item:', err);
      }
    });
  }

  getChecklistTypeName(tipo: TipoChecklist | undefined): string {
    switch (tipo) {
      case TipoChecklist.InicioObra: return 'Início de Obra';
      case TipoChecklist.EntregaObra: return 'Entrega de Obra';
      default: return 'Desconhecido';
    }
  }
}