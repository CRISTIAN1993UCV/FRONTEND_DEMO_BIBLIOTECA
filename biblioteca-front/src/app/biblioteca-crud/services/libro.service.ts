import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Libros } from '../interfaces/libro.interface';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  //SUBJECTS
  private libroSubject = new BehaviorSubject<Libros[]>([]);
  public  libro$ = this.libroSubject.asObservable();


  private _totalLibros = signal<number>(0);

  public totalLibros = computed(() => this._totalLibros());

  public setTotalItems(total: number): void {
    this._totalLibros.set(total);
  }



listarLibros():Observable<Libros[]>{
  return this.http.get<{content:Libros[]}>(`${this.baseUrl}/libro/listarLibros`)
  .pipe(
    map(response => response.content),
    tap(libro => this.libroSubject.next(libro)),
    tap(totalLibros => this.setTotalItems(totalLibros.length)),
    catchError(() => {
      this.libroSubject.next([]);
      return of([]);
    })
  );
}


/**
 * Verifica la disponibilidad de un libro para préstamo.
 * Retorna un objeto con las propiedades: libroId y disponible.
 */
verificarDisponibilidad(idLibro: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/libro/verificarDisponibilidad/${idLibro}`);
}

/**
 * Busca un libro por su ID.
 */
buscarLibro(idLibro: number): Observable<Libros> {
  return this.http.get<Libros>(`${this.baseUrl}/libro/buscar/${idLibro}`);
}

/**
 * Agrega un nuevo libro.
 */
agregarLibro(libro: Partial<Libros>): Observable<Libros> {
  return this.http.post<Libros>(`${this.baseUrl}/libro/agregarLibro`, libro)
  .pipe(
   tap(() => this.listarLibros().subscribe())
  );
}

/**
 * Actualiza la información de un libro existente.
 */
actualizarLibro(idLibro: number, libro: Partial<Libros>): Observable<Libros> {
  return this.http.put<Libros>(`${this.baseUrl}/libro/actualizar/${idLibro}`, libro)
  .pipe(
    tap(() => this.listarLibros().subscribe())
   );
}

/**
 * Elimina un libro por su ID.
 */
eliminarLibro(idLibro: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/libro/eliminar/${idLibro}`)
  .pipe(
    map( () => true),
    catchError(() => of(false)),
    tap(() => this.listarLibros().subscribe())
  );
}

}
