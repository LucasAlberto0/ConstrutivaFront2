import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DocumentoService } from '../../../shared/documento.service';
import { DocumentoListagemDto, DocumentoCriacaoDto } from '../../../shared/models/documento.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documento-list.component.html',
  styleUrl: './documento-list.component.scss'
})
export class DocumentoListComponent implements OnInit, OnChanges {
  @Input() obraId!: number;
  @Input() documentos: DocumentoListagemDto[] = [];
  @Output() documentoAdded = new EventEmitter<void>();
  @Output() documentoDeleted = new EventEmitter<void>(); // Assuming delete functionality will be added later

  selectedFile: File | null = null;
  uploadProgress: number = 0;
  selectedFolder: string = ''; // Added for folder selection
  groupedDocuments: { [key: string]: DocumentoListagemDto[] } = {}; // Added for grouping

  constructor(
    private documentoService: DocumentoService,
    private route: ActivatedRoute, // Keep for potential future use or if component can be used standalone
    private router: Router // Keep for potential future use or if component can be used standalone
  ) { }

  ngOnInit(): void {
    // If obraId is not provided as input, try to get it from route (for standalone usage)
    // This part is commented out because the component is expected to receive obraId as an Input
    /*
    if (!this.obraId) {
      this.route.parent?.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.obraId = +id;
          // If used standalone, load documents here
          // this.loadDocumentsInternal();
        } else {
          console.error('Obra ID not found in route parameters.');
          // this.router.navigate(['/dashboard']);
        }
      });
    }
    */
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentos'] && changes['documentos'].currentValue) {
      this.groupDocumentsByFolder(changes['documentos'].currentValue);
    }
  }

  private groupDocumentsByFolder(documents: DocumentoListagemDto[]): void {
    this.groupedDocuments = documents.reduce((acc, document) => {
      const folderName = document.tipo ? document.tipo.toString() : 'Outros'; // Group by 'tipo' instead of 'pasta'
      if (!acc[folderName]) {
        acc[folderName] = [];
      }
      acc[folderName].push(document);
      return acc;
    }, {} as { [key: string]: DocumentoListagemDto[] });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
  }

  onUpload(): void {
    if (!this.selectedFile || !this.obraId) {
      console.warn('No file selected or Obra ID is missing.');
      return;
    }

    const documentDescription = `Documento anexado para obra ${this.obraId}`;
    const documentType = this.selectedFolder || 'Outros'; // Use selected folder or default to 'Outros'

    // Step 1: Create a document entry with basic info, providing a placeholder for caminhoArquivo
    const newDocumento: DocumentoCriacaoDto = {
      nome: this.selectedFile.name,
      caminhoArquivo: this.selectedFile.name, // Providing file name as placeholder for URL
      obraId: this.obraId,
      descricao: documentDescription,
      tipo: documentType
    };

    this.documentoService.createDocumento(this.obraId, newDocumento).subscribe({
      next: (createdDocumento) => {
        if (createdDocumento.id) {
          // Step 2: Upload the file using the created document ID, passing description and type
          this.documentoService.uploadDocumento(this.obraId, createdDocumento.id, this.selectedFile!, documentDescription, documentType).subscribe({
            next: (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
              } else if (event.type === HttpEventType.Response) {
                console.log('File uploaded successfully!', event.body);
                this.selectedFile = null;
                this.uploadProgress = 0;
                this.documentoAdded.emit(); // Notify parent to refresh documents
              }
            },
            error: (uploadErr) => {
              console.error('Error uploading file', uploadErr);
              // Optionally, delete the created document entry if upload fails
              if (createdDocumento.id) {
                this.documentoService.deleteDocumento(this.obraId, createdDocumento.id).subscribe(() => {
                  console.log('Created document entry deleted due to upload failure.');
                });
              }
            }
          });
        }
      },
      error: (createErr) => {
        console.error('Error creating document entry', createErr);
      }
    });
  }

  onDownload(documento: DocumentoListagemDto): void {
    if (documento.id && this.obraId) {
      this.documentoService.downloadDocumento(this.obraId, documento.id).subscribe({
        next: (response: Blob) => {
          const filename = documento.nome || 'download';
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          a.href = objectUrl;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (err) => {
          console.error('Error downloading document', err);
        }
      });
    }
  }

  formatBytes(bytes: number | undefined, decimals = 2): string {
    if (bytes === undefined || bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onDelete(documento: DocumentoListagemDto): void {
    if (!documento.id || !this.obraId) {
      console.error('Document ID or Obra ID is missing for deletion.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o documento "${documento.nome}"?`)) {
      this.documentoService.deleteDocumento(this.obraId, documento.id).subscribe({
        next: () => {
          console.log(`Documento ${documento.nome} excluído com sucesso.`);
          this.documentoDeleted.emit(); // Notify parent to refresh documents
        },
        error: (err) => {
          console.error('Erro ao excluir documento:', err);
          // Optionally, display an error message to the user
        }
      });
    }
  }
}