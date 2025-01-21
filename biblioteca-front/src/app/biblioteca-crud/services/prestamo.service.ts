import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Prestamos } from '../interfaces/prestamos.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  //SUBJECTS
  private prestamoSubject = new BehaviorSubject<Prestamos[]>([]);
  public  prestamo$ = this.prestamoSubject.asObservable();

  private _totalPrestamos = signal<number>(0);

  public totalPrestamos = computed(() => this._totalPrestamos());

  public setTotalItems(total: number): void {
    this._totalPrestamos.set(total);
  }

  listarPrestamos():Observable<Prestamos[]>{
  return this.http.get<{content:Prestamos[]}>(`${this.baseUrl}/prestamo/listarPrestamos`)
  .pipe(
    map(response => response.content),
    tap(prestamo => this.prestamoSubject.next(prestamo)),
    tap(totalPrestamos => this.setTotalItems(totalPrestamos.length)),
    catchError(() => {
      this.prestamoSubject.next([]);
      return of([]);
    })
  );
}


  /**
   * Lista los préstamos asociados a un libro específico
   * @param libroId ID del libro
   */
  listarPrestamosPorLibro(libroId: number): Observable<Prestamos[]> {
    return this.http.get<Prestamos[]>(`${this.baseUrl}/prestamo/listarPorLibro/${libroId}`);
  }

  /**
   * Busca un préstamo por su ID
   * @param id ID del préstamo
   */
  buscarPrestamo(id: number): Observable<Prestamos> {
    return this.http.get<Prestamos>(`${this.baseUrl}/prestamo/buscar/${id}`);
  }

  /**
   * Crea un nuevo préstamo
   * @param prestamo Datos del préstamo a crear
   */
  agregarPrestamo(prestamo: Prestamos): Observable<Prestamos> {
    return this.http.post<Prestamos>(`${this.baseUrl}/prestamo/agregarPrestamo`, prestamo)
    .pipe(
      tap(() =>this.listarPrestamos().subscribe())
    );
  }

  /**
   * Actualiza un préstamo existente
   * @param id ID del préstamo
   * @param prestamo Datos actualizados del préstamo
   */
  actualizarPrestamo(id: number, prestamo: Prestamos): Observable<Prestamos> {
    return this.http.put<Prestamos>(`${this.baseUrl}/prestamo/actualizar/${id}`, prestamo)
    .pipe(
      tap(() =>this.listarPrestamos().subscribe())
    );
  }

  /**
   * Elimina un préstamo por su ID
   * @param id ID del préstamo
   */
  eliminarPrestamo(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/prestamo/eliminar/${id}`)
    .pipe(
      map( () => true),
      catchError(() => of(false)),
      tap(() => this.listarPrestamos().subscribe())
    );

  }
}
