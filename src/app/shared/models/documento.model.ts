import { TipoPasta } from './obra.model';

export interface DocumentoListagemDto {
  id?: number;
  nomeArquivo?: string;
  url?: string;
  pasta?: TipoPasta;
  obraId?: number;
}

export interface DocumentoCriacaoDto {
  nomeArquivo: string;
  url: string;
  pasta?: TipoPasta;
  obraId: number;
}

export interface DocumentoAtualizacaoDto {
  nomeArquivo: string;
  url: string;
  pasta?: TipoPasta;
}

export interface DocumentoDetalhesDto {
  id?: number;
  nomeArquivo?: string;
  url?: string;
  pasta?: TipoPasta;
  obraId?: number;
  nomeObra?: string;
}
