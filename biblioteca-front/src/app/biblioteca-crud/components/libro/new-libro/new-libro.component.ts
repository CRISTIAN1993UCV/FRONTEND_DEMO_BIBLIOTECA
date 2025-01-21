import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Libros } from '../../../interfaces/libro.interface';
import { LibroService } from '../../../services/libro.service';
import { Router } from '@angular/router';
import { Autor } from '../../../interfaces/autor.interface';
import { AutorService } from '../../../services/autor.service';
declare var bootstrap: any;
@Component({
  selector: 'app-new-libro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './new-libro.component.html',
  styleUrl: './new-libro.component.css'
})
export class NewLibroComponent {

  libroForm!: FormGroup;
  autores: Autor[] = []; // Lista de autores para el select

  @Input()
  public libro?:Libros | null;

  constructor(
    private fb: FormBuilder,
    private libroService: LibroService,
    private router: Router,
    private autorService: AutorService
  ) {}

  ngOnInit(): void {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      idAutor: ['', Validators.required],
      isbn: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      estado: ['', Validators.required],

    });

       // Cargar autores para el select
       this.autorService.listarAutores().subscribe({
        next: (autores) => (this.autores = autores),
        error: (err) => console.error('Error al cargar autores:', err)
      });
  }


  onSubmit(): void {
    if (this.libroForm.invalid) {
      this.libroForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    const formData = this.libroForm.value;

    this.libroService.agregarLibro(formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Libro agregado correctamente'
        });
        this.libroForm.reset();
             // Cerrar el modal programáticamente
             const modalElement = document.getElementById('agregarLibroModal');
             if (modalElement) {
               let modalInstance = bootstrap.Modal.getInstance(modalElement);
               if (!modalInstance) {
                 modalInstance = new bootstrap.Modal(modalElement);
               }
               modalInstance.hide();
             }
             this.libroForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el libro'
        });
        console.error('Error al agregar libro:', err);
      }
    });
  }
}
