import { TipoPasta } from './obra.model'; // Keep import for now, might be used elsewhere

export interface DocumentoListagemDto {
  id?: number;
  nome?: string;
  caminhoArquivo?: string;
  // pasta?: TipoPasta; // Removed as per backend update
  obraId?: number;
  descricao?: string;
  tamanhoArquivo?: number;
  dataAnexamento?: string;
  dataUpload?: string;
  tipo?: string; // Confirmed present
}

export interface DocumentoCriacaoDto {
  nome: string;
  caminhoArquivo: string;
  // pasta?: TipoPasta; // Removed as per backend update
  obraId: number;
  descricao?: string;
  tipo: string; // Confirmed present and required
}

export interface DocumentoAtualizacaoDto {
  nome: string;
  caminhoArquivo: string;
  // pasta?: TipoPasta; // Removed as per backend update
  descricao?: string;
  tipo?: string; // Confirmed present
}

export interface DocumentoDetalhesDto {
  id?: number;
  nome?: string;
  caminhoArquivo?: string;
  // pasta?: TipoPasta; // Removed as per backend update
  obraId?: number;
  nomeObra?: string;
  descricao?: string;
  tamanhoArquivo?: number;
  dataAnexamento?: string;
  dataUpload?: string;
  tipo?: string; // Confirmed present
}
