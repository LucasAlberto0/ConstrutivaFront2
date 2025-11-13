export interface AditivoListagemDto {
  id?: number;
  descricao?: string;
  data?: string;
  obraId?: number;
}

export interface AditivoCriacaoDto {
  descricao: string;
  data: string;
  obraId: number;
}

export interface AditivoAtualizacaoDto {
  descricao: string;
  data: string;
}

export interface AditivoDetalhesDto {
  id?: number;
  descricao?: string;
  data?: string;
  obraId?: number;
  nomeObra?: string;
}
