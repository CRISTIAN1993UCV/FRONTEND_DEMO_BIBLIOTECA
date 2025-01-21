import { Component, inject } from '@angular/core';
import { ListAutorComponent } from "../../components/autor/list-autor/list-autor.component";
import { NewAutorComponent } from "../../components/autor/new-autor/new-autor.component";
import { Autor } from '../../interfaces/autor.interface';
import { AutorService } from '../../services/autor.service';
import { UpdateAutorComponent } from "../../components/autor/update-autor/update-autor.component";

@Component({
  selector: 'app-autor-page',
  standalone: true,
  imports: [ListAutorComponent, NewAutorComponent, UpdateAutorComponent],
  templateUrl: './autor-page.component.html',
  styleUrl: './autor-page.component.css'
})
export default class AutorPageComponent {

  private autorService = inject(AutorService);
  public autorObtenido?:Autor | null;


  getAutorId(id:number){
    this.autorService.buscarAutor(id).subscribe(
      autor => {
        if(!autor) return;
        this.autorObtenido = autor;
      });
  }

}
