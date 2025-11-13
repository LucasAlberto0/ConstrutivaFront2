import { ObraListagemDto } from './obra.model';

export interface DashboardSummaryDto {
  totalObras?: number;
  obrasEmAndamento?: number;
  obrasEmManutencao?: number;
  obrasSuspensas?: number;
  obrasFinalizadas?: number;
  obrasRecentes?: ObraListagemDto[];
}
