import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Prestamos } from '../../../interfaces/prestamos.interface';
import { PrestamoService } from '../../../services/prestamo.service';
import { Router } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libros } from '../../../interfaces/libro.interface';
declare var bootstrap: any;
@Component({
  selector: 'app-new-prestamo',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './new-prestamo.component.html',
  styleUrl: './new-prestamo.component.css'
})
export class NewPrestamoComponent {

  prestamoForm!: FormGroup;
  libros: Libros[] = []; // Lista de autores para el select

  @Input()
  public prestamo?:Prestamos | null;

  constructor(
    private fb: FormBuilder,
    private prestamoService: PrestamoService,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    this.prestamoForm = this.fb.group({
      libroId: ['', Validators.required],
      fechaPrestamo: ['', Validators.required],
      fechaDevolucion: ['', Validators.required],
      estado: ['', Validators.required],

    });

       // Cargar libros para el select
       this.libroService.listarLibros().subscribe({
        next: (libros) => (this.libros = libros),
        error: (err) => console.error('Error al cargar libros:', err)
      });
  }


  onSubmit(): void {
    if (this.prestamoForm.invalid) {
      this.prestamoForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    const formData = this.prestamoForm.value;

    this.prestamoService.agregarPrestamo(formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Prestamo agregado correctamente'
        });
        this.prestamoForm.reset();
             // Cerrar el modal programáticamente
             const modalElement = document.getElementById('agregarPrestamoModal');
             if (modalElement) {
               let modalInstance = bootstrap.Modal.getInstance(modalElement);
               if (!modalInstance) {
                 modalInstance = new bootstrap.Modal(modalElement);
               }
               modalInstance.hide();
             }
             this.prestamoForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el prestamo'
        });
        console.error('Error al agregar prestamo:', err);
      }
    });
  }
}
