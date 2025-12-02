export enum ChecklistTipo {
  InicioObra = 0,
  EntregaObra = 1,
}

export interface ChecklistItemCriacaoDto {
  Nome: string;
  Concluido: boolean;
  Observacao: string;
}

export interface ChecklistCriacaoDto {
  Tipo: ChecklistTipo;
  ObraId: number;
  Itens: ChecklistItemCriacaoDto[];
}