import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Prestamos } from '../../../interfaces/prestamos.interface';
import { Subscription } from 'rxjs';
import { PrestamoService } from '../../../services/prestamo.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'list-prestamo',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './list-prestamo.component.html',
  styleUrl: './list-prestamo.component.css'
})
export class ListPrestamoComponent {

 @Input()
  public prestamo:Prestamos[] = [];
  public libroId: number = 0;

  @Output()
  public obtenerPrestamoPorId = new EventEmitter<number>();

  private prestamoSubscription?:Subscription;

  constructor(private prestamoService: PrestamoService) {}



  ngOnInit(): void {
    this.prestamoSubscription = this.prestamoService.prestamo$.subscribe(prestamo => this.prestamo = prestamo);
     this.prestamoService.listarPrestamos().subscribe();

   }

   listarPrestamos(): void {
    if (this.libroId > 0) {
      this.prestamoService.listarPrestamosPorLibro(this.libroId).subscribe({
        next: (prestamos) => {
          if (prestamos.length > 0) {
            this.prestamo = prestamos; // Actualiza la lista si hay resultados
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Sin Resultados',
              text: 'No se encontraron préstamos para el ID ingresado.',
            });
          }
        },
        error: () =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los préstamos para el ID ingresado.',
          }),
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Aviso',
        text: 'Por favor ingresa un ID de libro válido.',
      });
    }
  }



  listarTodosPrestamos(): void {
    this.prestamoService.listarPrestamos().subscribe({
      next: (prestamos) => (this.prestamo = prestamos),
      error: () =>
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los préstamos.',
        }),
    });
  }

  reiniciarPrestamos(): void {
    this.libroId = 0; // Reiniciar el campo de entrada
    this.listarTodosPrestamos(); // Cargar todos los préstamos
  }


   obtenerPrestamoId(id:number){
    this.obtenerPrestamoPorId.emit(id);
  }

  eliminarPrestamo(id: number): void {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para eliminar
        this.prestamoService.eliminarPrestamo(id).subscribe((resultado) => {
          if (resultado) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El prestamo se eliminó correctamente'
            });

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el prestamo'
            });
          }
        });
      }
    });
  }

}
