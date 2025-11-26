import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ObraService } from '../../shared/obra.service';
import { AuthService } from '../../shared/auth.service'; // Added import

@Component({
  selector: 'app-obra-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './obra-create.component.html',
  styleUrls: ['./obra-create.component.scss']
})
export class ObraCreateComponent {
  obraForm: FormGroup;
  loading = false;
  error: string | null = null;
  statuses = [
    { value: 0, name: 'Em Andamento' },
    { value: 1, name: 'Em Manutenção' },
    { value: 2, name: 'Suspensa' },
    { value: 3, name: 'Finalizada' }
  ];
  canCreateObra: boolean = false; // Added property

  constructor(
    private fb: FormBuilder,
    private obraService: ObraService,
    private router: Router,
    private authService: AuthService // Injected AuthService
  ) {
    this.obraForm = this.fb.group({
      nome: ['', Validators.required],
      localizacao: ['', Validators.required],
      contratante: ['', Validators.required],
      contrato: ['', Validators.required],
      ordemInicioServico: ['', Validators.required],
      coordenadorNome: ['', Validators.required],
      administradorNome: [''],
      responsavelTecnicoNome: ['', Validators.required],
      equipe: ['', Validators.required],
      dataInicio: ['', Validators.required],
      dataTermino: ['', Validators.required],
      observacoes: [''],
      status: [0, Validators.required] // Default status to 0 'Em Andamento'
    });
    this.canCreateObra = this.authService.hasRole(['Admin', 'Coordenador']); // Initialize canCreateObra
    console.log('ObraCreateComponent: canCreateObra =', this.canCreateObra); // Added console.log
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.obraForm.valid) {
      this.loading = true;
      this.error = null;

      const formValue = this.obraForm.value;
      const obraData = {
        ...formValue,
        dataInicio: new Date(formValue.dataInicio + 'T00:00:00Z').toISOString(),
        dataTermino: new Date(formValue.dataTermino + 'T00:00:00Z').toISOString(),
        status: Number(formValue.status)
      };

      this.obraService.createObra(obraData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to create obra. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
