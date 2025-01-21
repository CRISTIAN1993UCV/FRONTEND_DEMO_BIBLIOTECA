import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Autor } from '../../../interfaces/autor.interface';
import { Libros } from '../../../interfaces/libro.interface';
import { LibroService } from '../../../services/libro.service';
import { Router } from '@angular/router';
import { AutorService } from '../../../services/autor.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
@Component({
  selector: 'app-update-libro',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-libro.component.html',
  styleUrl: './update-libro.component.css'
})
export class UpdateLibroComponent implements OnInit, OnChanges {

  libroForm!: FormGroup;
  autores: Autor[] = []; // Lista de autores para el select

  @Input()
  public libro?:Libros | null;

  constructor(
    private fb: FormBuilder,
    private LibroService: LibroService,
    private router: Router,
    private autorService: AutorService
  ) {}

  ngOnInit(): void {
    this.libroForm = this.fb.group({
      idLibro: ['', Validators.required],
      titulo: ['', Validators.required],
      idAutor: ['', Validators.required],
      isbn: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      estado: ['', Validators.required],

    });

       // Cargar autores para el select
       this.autorService.listarAutores().subscribe({
        next: (autores) => (this.autores = autores),
        error: (err) => console.error('Error al cargar libros:', err)
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['libro'] && changes['libro'].currentValue) {
      const libro = changes['libro'].currentValue as Libros;
      if (libro) {
        this.libroForm.patchValue({
          idLibro: libro.idLibro,
          titulo: libro.titulo,
          idAutor: libro.autor?.idAutor, // Aquí asignamos el idAutor
          isbn: libro.isbn,
          fechaPublicacion: libro.fechaPublicacion ,
          estado: libro.estado
        });
      }
    }
  }


  get atuorActualesForm():Libros{
    const libro = this.libroForm.value as Libros;
    return libro;
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

    this.LibroService.actualizarLibro(this.atuorActualesForm.idLibro, formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Libro actualizar correctamente'
        });
        this.libroForm.reset();
             // Cerrar el modal programáticamente
             const modalElement = document.getElementById('actualizarLibroModal');
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
          text: 'No se pudo actualizar el libro'
        });
        console.error('Error al actualizar libro:', err);
      }
    });
  }
}
