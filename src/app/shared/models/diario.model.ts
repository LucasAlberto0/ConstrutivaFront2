import { ComentarioDto } from './comentario.model';
import { FotoDiarioDto } from './foto-diario.model';

export interface DiarioObraListagemDto {
  id?: number;
  data?: string;
  clima?: string;
  obraId?: number;
  nomeObra?: string;
}

export interface DiarioObraCriacaoDto {
  data: string;
  clima?: string;
  colaboradores?: string;
  atividades?: string;
  obraId: number;
  fotosUrls?: string[];
  comentarios?: ComentarioCriacaoDto[];
}

export interface DiarioObraAtualizacaoDto {
  data: string;
  clima?: string;
  colaboradores?: string;
  atividades?: string;
}

export interface DiarioObraDetalhesDto {
  id?: number;
  data?: string;
  clima?: string;
  colaboradores?: string;
  atividades?: string;
  obraId?: number;
  nomeObra?: string;
  fotos?: FotoDiarioDto[];
  comentarios?: ComentarioDto[];
}

export interface ComentarioCriacaoDto {
  texto: string;
  autorId: string;
}
