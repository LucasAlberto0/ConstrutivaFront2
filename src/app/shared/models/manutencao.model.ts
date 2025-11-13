export interface ManutencaoListagemDto {
  id?: number;
  dataInicio?: string;
  dataTermino?: string;
  imagemUrl?: string;
  datasManutencao?: string;
  obraId?: number;
  nomeObra?: string;
}

export interface ManutencaoCriacaoDto {
  dataInicio: string;
  dataTermino: string;
  imagemUrl?: string;
  datasManutencao?: string;
  obraId: number;
}

export interface ManutencaoAtualizacaoDto {
  dataInicio: string;
  dataTermino: string;
  imagemUrl?: string;
  datasManutencao?: string;
}

export interface ManutencaoDetalhesDto {
  id?: number;
  dataInicio?: string;
  dataTermino?: string;
  imagemUrl?: string;
  datasManutencao?: string;
  obraId?: number;
  nomeObra?: string;
}
