import { Component, computed, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { PrestamoService } from './services/prestamo.service';
import { Subscription } from 'rxjs';
import { Prestamos } from './interfaces/prestamos.interface';
import { LibroService } from './services/libro.service';
import { Libros } from './interfaces/libro.interface';
import { AutorService } from './services/autor.service';
import { Autor } from './interfaces/autor.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './dashboard.component.html',
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class DashboardComponent {

  public librosTotales = computed(() => this.libroService.totalLibros());
  public autoresTotales = computed(() => this.autorService.totalAutores());
  public prestamosTotales = computed(() => this.prestamoService.totalPrestamos());

  constructor(private router: Router,
    private prestamoService: PrestamoService,
    private libroService: LibroService,
    private autorService: AutorService,
  ) {}

  ngOnInit() {
    // Establece el valor inicial usando la URL actual
    this.setPaginaActual(this.router.url);

    // Suscribirse a los eventos del router para detectar los cambios en la navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setPaginaActual(event.urlAfterRedirects);
      }
    });

  }




  ngAfterViewInit(): void {
    const sideMenu = document.querySelectorAll(".enlace");

    sideMenu.forEach((item) => {
      const li = item.parentElement;

      item.addEventListener("click", () => {
        sideMenu.forEach((link) => {
          link.parentElement?.classList.remove("activo");
        });
        li?.classList.add("activo");
      });
    });

    const menuBar = document.querySelector(".menu-btn");
    const sideBar = document.querySelector(".barra-lateral");

    menuBar?.addEventListener("click", () => {
      sideBar?.classList.toggle("hide");
    });
  }

  paginaActual: string = '';




  private setPaginaActual(url: string): void {
    const currentUrl = url.toLowerCase();

    if (currentUrl.includes('autor')) {
      this.paginaActual = 'Autor';
    } else if (currentUrl.includes('libro')) {
      this.paginaActual = 'Libro';
    } else if (currentUrl.includes('prestamo')) {
      this.paginaActual = 'Prestamo';
    } else {
      this.paginaActual = 'Dashboard';
    }
  }



}
