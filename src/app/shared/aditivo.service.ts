import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AditivoListagemDto, AditivoCriacaoDto, AditivoAtualizacaoDto, AditivoDetalhesDto } from './models/aditivo.model';

@Injectable({
  providedIn: 'root'
})
export class AditivoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAditivos(obraId: number): Observable<AditivoListagemDto[]> {
    return this.http.get<AditivoListagemDto[]>(`${this.apiUrl}/api/obras/${obraId}/Aditivos`);
  }

  getAditivoById(obraId: number, id: number): Observable<AditivoDetalhesDto> {
    return this.http.get<AditivoDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Aditivos/${id}`);
  }

  createAditivo(obraId: number, aditivo: AditivoCriacaoDto): Observable<AditivoDetalhesDto> {
    return this.http.post<AditivoDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Aditivos`, aditivo);
  }

  updateAditivo(obraId: number, id: number, aditivo: AditivoAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/obras/${obraId}/Aditivos/${id}`, aditivo);
  }

  deleteAditivo(obraId: number, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Aditivos/${id}`);
  }
}