import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ChecklistService } from '../../shared/checklist.service'; // Import ChecklistService
import { ChecklistCriacaoDto, ChecklistItemCriacaoDto, ChecklistTipo } from '../../shared/models/checklist.model'; // Import DTOs
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef

interface ChecklistItem {
  name: string;
  completed: boolean;
}

@Component({
  selector: 'app-checklists-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checklists-page.component.html',
  styleUrls: ['./checklists-page.component.scss']
})
export class ChecklistsPageComponent implements OnInit {
  @Input() obraId!: number; // Input to receive obraId from route or parent component

  showInicioObraChecklist: boolean = true; // Set to true to show by default
  showEntregaObraChecklist: boolean = false;

  inicioObraChecklist: ChecklistItem[] = [
    { name: 'ART / RRT', completed: false },
    { name: 'Placa de obra instalada', completed: false },
    { name: 'EPIs disponíveis', completed: false },
    { name: 'CIPA constituída', completed: false },
    { name: 'Alvará de construção', completed: false },
    { name: 'Procuração e documentos', completed: false },
    { name: 'Diário de obra iniciado', completed: false },
    { name: 'Canteiro de obras montado', completed: false },
  ];

  entregaObraChecklist: ChecklistItem[] = [
    { name: 'Limpeza final realizada', completed: false },
    { name: 'Termos de garantia assinados', completed: false },
    { name: 'Manuais de equipamentos entregues', completed: false },
    { name: 'As Built finalizado', completed: false },
    { name: 'Habite-se obtido', completed: false },
    { name: 'Jogo de chaves entregue', completed: false },
    { name: 'Vistoria final aprovada', completed: false },
    { name: 'Documentação completa arquivada', completed: false },
  ];

  constructor(
    private route: ActivatedRoute,
    private checklistService: ChecklistService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.obraId = +id;
        console.log('ChecklistsPageComponent received obraId:', this.obraId);

        // Load InicioObra checklist
        this.checklistService.getChecklist(this.obraId, ChecklistTipo.InicioObra).subscribe({
          next: (data: any) => {
            if (data && data.itens && data.itens.length > 0) {
              this.inicioObraChecklist = data.itens.map((item: any) => ({
                name: item.nome,
                completed: item.concluido // Use lowercase 'c' as per backend response
              }));
              console.log('InicioObraChecklist populated from backend:', this.inicioObraChecklist); // More specific log
              this.cdr.detectChanges(); // Explicitly trigger change detection
            } else {
              console.log('No existing InicioObra checklist found, using default.');
            }
          },
          error: (err: any) => {
            console.warn('No existing InicioObra checklist found or error loading:', err);
            // Keep default checklist if not found or error
          }
        });

        // Load EntregaObra checklist
        this.checklistService.getChecklist(this.obraId, ChecklistTipo.EntregaObra).subscribe({
          next: (data: any) => {
            if (data && data.itens && data.itens.length > 0) {
              this.entregaObraChecklist = data.itens.map((item: any) => ({
                name: item.nome,
                completed: item.concluido // Use lowercase 'c' as per backend response
              }));
              console.log('EntregaObraChecklist populated from backend:', this.entregaObraChecklist); // More specific log
              this.cdr.detectChanges(); // Explicitly trigger change detection
            } else {
              console.log('No existing EntregaObra checklist found, using default.');
            }
          },
          error: (err: any) => {
            console.warn('No existing EntregaObra checklist found or error loading:', err);
            // Keep default checklist if not found or error
          }
        });

      } else {
        console.error('ChecklistsPageComponent: obraId not found in route parameters.');
      }
    });
  }

  getInicioObraProgress(): number {
    if (this.inicioObraChecklist.length === 0) return 0;
    const completedItems = this.inicioObraChecklist.filter(item => item.completed).length;
    return (completedItems / this.inicioObraChecklist.length) * 100;
  }

  getEntregaObraProgress(): number {
    if (this.entregaObraChecklist.length === 0) return 0;
    const completedItems = this.entregaObraChecklist.filter(item => item.completed).length;
    return (completedItems / this.entregaObraChecklist.length) * 100;
  }

  toggleChecklist(type: 'inicio' | 'entrega'): void {
    if (type === 'inicio') {
      this.showInicioObraChecklist = !this.showInicioObraChecklist;
      this.showEntregaObraChecklist = false; // Close other checklist
    } else {
      this.showEntregaObraChecklist = !this.showEntregaObraChecklist;
      this.showInicioObraChecklist = false; // Close other checklist
    }
  }

  calculateProgress(type: 'inicio' | 'entrega'): void {
    // Progress is automatically recalculated by the getters when items change
    // This method can be used for any additional logic if needed, e.g., saving state
  }

  saveChecklist(type: 'inicio' | 'entrega'): void {
    if (!this.obraId) {
      console.error('Obra ID is missing, cannot save checklist.');
      return;
    }

    let checklistToSave: ChecklistCriacaoDto;
    let checklistItems: ChecklistItemCriacaoDto[];
    let checklistTipo: ChecklistTipo;

    if (type === 'inicio') {
      checklistItems = this.inicioObraChecklist.map(item => ({
        Nome: item.name,
        Concluido: item.completed,
        Observacao: '' // Assuming no observation for now
      }));
      checklistTipo = ChecklistTipo.InicioObra;
    } else {
      checklistItems = this.entregaObraChecklist.map(item => ({
        Nome: item.name,
        Concluido: item.completed,
        Observacao: '' // Assuming no observation for now
      }));
      checklistTipo = ChecklistTipo.EntregaObra;
    }

    checklistToSave = {
      Tipo: checklistTipo,
      ObraId: this.obraId,
      Itens: checklistItems
    };
    console.log('Payload being sent to backend:', checklistToSave); // Add this line

    this.checklistService.createChecklist(this.obraId, checklistToSave).subscribe({
      next: (response: any) => {
        console.log('Checklist saved successfully:', response);
        // Optionally, show a success message to the user
      },
      error: (error: any) => {
        console.error('Error saving checklist:', error);
        // Optionally, show an error message to the user
      }
    });
  }
}