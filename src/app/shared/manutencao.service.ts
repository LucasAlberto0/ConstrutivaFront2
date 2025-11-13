import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ManutencaoListagemDto, ManutencaoCriacaoDto, ManutencaoAtualizacaoDto, ManutencaoDetalhesDto } from './models/manutencao.model';

@Injectable({
  providedIn: 'root'
})
export class ManutencaoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getManutencoes(obraId: number): Observable<ManutencaoListagemDto[]> {
    return this.http.get<ManutencaoListagemDto[]>(`${this.apiUrl}/api/obras/${obraId}/Manutencoes`);
  }

  getManutencaoById(obraId: number, id: number): Observable<ManutencaoDetalhesDto> {
    return this.http.get<ManutencaoDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Manutencoes/${id}`);
  }

  createManutencao(obraId: number, manutencao: ManutencaoCriacaoDto): Observable<ManutencaoDetalhesDto> {
    return this.http.post<ManutencaoDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Manutencoes`, manutencao);
  }

  updateManutencao(obraId: number, id: number, manutencao: ManutencaoAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/obras/${obraId}/Manutencoes/${id}`, manutencao);
  }

  deleteManutencao(obraId: number, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Manutencoes/${id}`);
  }
}