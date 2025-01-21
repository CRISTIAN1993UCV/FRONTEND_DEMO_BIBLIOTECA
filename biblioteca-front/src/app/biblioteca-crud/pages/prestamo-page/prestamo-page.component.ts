import { Component, inject } from '@angular/core';
import { ListPrestamoComponent } from "../../components/prestamo/list-prestamo/list-prestamo.component";
import { NewPrestamoComponent } from "../../components/prestamo/new-prestamo/new-prestamo.component";
import { UpdatePrestamoComponent } from "../../components/prestamo/update-prestamo/update-prestamo.component";
import { Prestamos } from '../../interfaces/prestamos.interface';
import { PrestamoService } from '../../services/prestamo.service';

@Component({
  selector: 'app-prestamo-page',
  standalone: true,
  imports: [ListPrestamoComponent, NewPrestamoComponent, UpdatePrestamoComponent],
  templateUrl: './prestamo-page.component.html',
  styleUrl: './prestamo-page.component.css'
})
export default class PrestamoPageComponent {

  private prestamoService = inject(PrestamoService);
  public prestamoObtenido?:Prestamos | null;


  getPrestamoId(id:number){
    this.prestamoService.buscarPrestamo(id).subscribe(
      prestamo => {
        if(!prestamo) return;
        this.prestamoObtenido = prestamo;
      });
  }

}
