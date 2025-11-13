import { TipoChecklist, ChecklistItemDto } from './obra.model';

export interface ChecklistListagemDto {
  id?: number;
  tipo?: TipoChecklist;
  obraId?: number;
  nomeObra?: string;
}

export interface ChecklistCriacaoDto {
  tipo: TipoChecklist;
  obraId: number;
  itens?: ChecklistItemCriacaoDto[];
}

export interface ChecklistAtualizacaoDto {
  tipo: TipoChecklist;
  itens?: ChecklistItemAtualizacaoDto[];
}

export interface ChecklistDetalhesDto {
  id?: number;
  tipo?: TipoChecklist;
  obraId?: number;
  nomeObra?: string;
  itens?: ChecklistItemDto[];
}

export interface ChecklistItemCriacaoDto {
  nome: string;
  concluido?: boolean;
  observacao?: string;
}

export interface ChecklistItemAtualizacaoDto {
  id: number;
  nome: string;
  concluido?: boolean;
  observacao?: string;
}
