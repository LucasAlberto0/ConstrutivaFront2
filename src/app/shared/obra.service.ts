import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ObraListagemDto, ObraDetalhesDto, ObraCriacaoDto, ObraAtualizacaoDto } from './models/obra.model';

@Injectable({
  providedIn: 'root'
})
export class ObraService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getObras(): Observable<ObraListagemDto[]> {
    return this.http.get<ObraListagemDto[]>(`${this.apiUrl}/api/Obras`);
  }

  getObraById(id: number): Observable<ObraDetalhesDto> {
    return this.http.get<ObraDetalhesDto>(`${this.apiUrl}/api/Obras/${id}`);
  }

  createObra(obra: ObraCriacaoDto): Observable<ObraDetalhesDto> {
    return this.http.post<ObraDetalhesDto>(`${this.apiUrl}/api/Obras`, obra);
  }

  updateObra(id: number, obra: ObraAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/Obras/${id}`, obra);
  }

  deleteObra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/Obras/${id}`);
  }
}