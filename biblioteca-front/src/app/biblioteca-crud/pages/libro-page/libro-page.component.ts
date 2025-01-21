import { Component, inject } from '@angular/core';
import { ListLibroComponent } from "../../components/libro/list-libro/list-libro.component";
import { NewLibroComponent } from "../../components/libro/new-libro/new-libro.component";
import { UpdateLibroComponent } from "../../components/libro/update-libro/update-libro.component";
import { Libros } from '../../interfaces/libro.interface';
import { LibroService } from '../../services/libro.service';

@Component({
  selector: 'app-libro-page',
  standalone: true,
  imports: [ListLibroComponent,  NewLibroComponent, UpdateLibroComponent],
  templateUrl: './libro-page.component.html',
  styleUrl: './libro-page.component.css'
})
export default class LibroPageComponent {


  private libroService = inject(LibroService);
  public libroObtenido?:Libros | null;


  getAutorId(id:number){
    this.libroService.buscarLibro(id).subscribe(
      libro => {
        if(!libro) return;
        this.libroObtenido = libro;
      });
  }
}
