import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Libros } from '../../../interfaces/libro.interface';
import { Prestamos } from '../../../interfaces/prestamos.interface';
import { PrestamoService } from '../../../services/prestamo.service';
import { Router } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;
@Component({
  selector: 'app-update-prestamo',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './update-prestamo.component.html',
  styleUrl: './update-prestamo.component.css'
})
export class UpdatePrestamoComponent  implements OnInit, OnChanges{

  prestamoForm!: FormGroup;
  libros: Libros[] = []; // Lista de autores para el select

  @Input()
  public prestamo?:Prestamos | null;

  @ViewChild('modalElement', { static: true }) modalElement!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private prestamoService: PrestamoService,
    private router: Router,
    private libroService: LibroService
  ) {}

  ngOnInit(): void {
    this.prestamoForm = this.fb.group({
      idPrestamo:['', Validators.required],
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

        // Escuchar el evento `hidden.bs.modal` y limpiar el formulario
    const modal = this.modalElement.nativeElement;
    modal.addEventListener('hidden.bs.modal', () => this.limpiarFormulario());
  }

  limpiarFormulario(): void {
    this.prestamoForm.reset();
  }

 ngOnChanges(changes: SimpleChanges): void {
    if (changes['prestamo'] && changes['prestamo'].currentValue) {
      const prestamo = changes['prestamo'].currentValue as Prestamos;
      if (prestamo) {
        this.prestamoForm.patchValue({
          idPrestamo: prestamo.idPrestamo,
          libroId: prestamo.libro?.idLibro,
          fechaPrestamo: prestamo.fechaPrestamo,
          fechaDevolucion: prestamo.fechaDevolucion,
          estado: prestamo.estado
        });
      }
    }
  }


  get atuorActualesForm():Prestamos{
    const prestamo = this.prestamoForm.value as Prestamos;
    return prestamo;
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

    this.prestamoService.actualizarPrestamo(this.atuorActualesForm.idPrestamo,formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Prestamo actualizar correctamente'
        });

             // Cerrar el modal programáticamente
             const modalElement = document.getElementById('actualizarPrestamoModal');
             if (modalElement) {
               let modalInstance = bootstrap.Modal.getInstance(modalElement);
               if (!modalInstance) {
                 modalInstance = new bootstrap.Modal(modalElement);
               }
               modalInstance.hide();
             }
             this.limpiarFormulario();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el prestamo'
        });
        console.error('Error al actualizar prestamo:', err);
      }
    });
  }
}
