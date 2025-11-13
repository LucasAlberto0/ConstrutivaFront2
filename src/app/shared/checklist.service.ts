import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ChecklistListagemDto, ChecklistCriacaoDto, ChecklistAtualizacaoDto, ChecklistDetalhesDto, ChecklistItemCriacaoDto, ChecklistItemAtualizacaoDto } from './models/checklist.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getChecklists(obraId: number): Observable<ChecklistListagemDto[]> {
    return this.http.get<ChecklistListagemDto[]>(`${this.apiUrl}/api/obras/${obraId}/Checklists`);
  }

  getChecklistById(obraId: number, id: number): Observable<ChecklistDetalhesDto> {
    return this.http.get<ChecklistDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Checklists/${id}`);
  }

  createChecklist(obraId: number, checklist: ChecklistCriacaoDto): Observable<ChecklistDetalhesDto> {
    return this.http.post<ChecklistDetalhesDto>(`${this.apiUrl}/api/obras/${obraId}/Checklists`, checklist);
  }

  updateChecklist(obraId: number, id: number, checklist: ChecklistAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/obras/${obraId}/Checklists/${id}`, checklist);
  }

  deleteChecklist(obraId: number, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Checklists/${id}`);
  }

  addItemToChecklist(obraId: number, checklistId: number, item: ChecklistItemCriacaoDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/obras/${obraId}/Checklists/${checklistId}/itens`, item);
  }

  updateChecklistItem(obraId: number, checklistId: number, itemId: number, item: ChecklistItemAtualizacaoDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/obras/${obraId}/Checklists/${checklistId}/itens/${itemId}`, item);
  }

  deleteChecklistItem(obraId: number, checklistId: number, itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/obras/${obraId}/Checklists/${checklistId}/itens/${itemId}`);
  }
}