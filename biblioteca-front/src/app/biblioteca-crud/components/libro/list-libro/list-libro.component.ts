import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { Libros } from '../../../interfaces/libro.interface';
import { Subscription } from 'rxjs';
import { LibroService } from '../../../services/libro.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'list-libro',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './list-libro.component.html',
  styleUrl: './list-libro.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListLibroComponent {
 @Input()
  public libro:Libros[] = [];


  @Output()
  public obtenerLibroPorId = new EventEmitter<number>();


  private libroSubscription?:Subscription;
  public libroId: number = 0;
  constructor(private libroService: LibroService) {}



  ngOnInit(): void {
    this.libroSubscription = this.libroService.libro$.subscribe(libro => this.libro = libro);
     this.libroService.listarLibros().subscribe();
   }

   obtenerLibroId(id:number){
    this.obtenerLibroPorId.emit(id);
  }

  eliminarAutor(id: number): void {
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
        this.libroService.eliminarLibro(id).subscribe((resultado) => {
          if (resultado) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El libro se eliminó correctamente'
            });

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el libro'
            });
          }
        });
      }
    });
  }
  verificarDisponibilidad(): void {
    if (this.libroId <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ID Inválido',
        text: 'Por favor, ingresa un ID válido para verificar la disponibilidad.',
      });
      return;
    }

    this.libroService.verificarDisponibilidad(this.libroId).subscribe({
      next: (resultado) => {
        if (resultado.disponible) {
          Swal.fire({
            icon: 'success',
            title: 'Disponible',
            text: `El libro con ID ${this.libroId} está disponible.`,
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No Disponible',
            text: `El libro con ID ${this.libroId} no está disponible.`,
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'No Encontrado',
          text: `No se encontró un libro con el ID ${this.libroId}. Por favor, verifica e intenta nuevamente.`,
        });
      },
    });
  }




}
