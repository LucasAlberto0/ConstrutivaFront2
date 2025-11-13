import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DiarioObraListagemDto, DiarioObraCriacaoDto, DiarioObraAtualizacaoDto, DiarioObraDetalhesDto, ComentarioCriacaoDto } from './models/diario.model';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDiarios(obraId: number): Observable<DiarioObraListagemDto[]> {
    return this.http.get<DiarioObraListagemDto[]>(`${this.apiUrl}/api/obras/${obraId}/Diarios`);
  }

  getDiarioById(obraId: number, id: number): Observable<DiarioObraDetalhesDto> {
    return this.http.get<DiarioObraDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Diarios/${id}`);
  }

  createDiario(obraId: number, diario: DiarioObraCriacaoDto): Observable<DiarioObraDetalhesDto> {
    return this.http.post<DiarioObraDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Diarios`, diario);
  }

  updateDiario(obraId: number, id: number, diario: DiarioObraAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/obras/${obraId}/Diarios/${id}`, diario);
  }

  deleteDiario(obraId: number, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Diarios/${id}`);
  }

  addFotoToDiario(obraId: number, diarioId: number, fotoUrl: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/obras/${obraId}/Diarios/${diarioId}/fotos`, JSON.stringify(fotoUrl), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteFotoFromDiario(obraId: number, diarioId: number, fotoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Diarios/${diarioId}/fotos/${fotoId}`);
  }

  addComentarioToDiario(obraId: number, diarioId: number, comentario: ComentarioCriacaoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/obras/${obraId}/Diarios/${diarioId}/comentarios`, comentario);
  }

  deleteComentarioFromDiario(obraId: number, diarioId: number, comentarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Diarios/${diarioId}/comentarios/${comentarioId}`);
  }
}