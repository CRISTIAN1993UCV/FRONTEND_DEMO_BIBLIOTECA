import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../interfaces/autor.interface';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'list-autor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-autor.component.html',
  styleUrl: './list-autor.component.css',
     schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListAutorComponent implements OnInit{

  @Input()
  public autor:Autor[] = [];


  @Output()
  public obtenerAutorPorId = new EventEmitter<number>();


  private autorSubscription?:Subscription;

  constructor(private autorService: AutorService) {}



  ngOnInit(): void {
    this.autorSubscription = this.autorService.autor$.subscribe(autor => this.autor = autor);
     this.autorService.listarAutores().subscribe();
   }

   obtenerAutorId(id:number){
    this.obtenerAutorPorId.emit(id);
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
        this.autorService.eliminarAutor(id).subscribe((resultado) => {
          if (resultado) {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El autor se eliminó correctamente'
            });

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el autor'
            });
          }
        });
      }
    });
  }
}
