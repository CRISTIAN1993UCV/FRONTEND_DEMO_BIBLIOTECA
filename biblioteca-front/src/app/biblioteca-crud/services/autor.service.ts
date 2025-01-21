import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Autor } from '../interfaces/autor.interface';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  private readonly baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  //SUBJECTS
  private autorSubject = new BehaviorSubject<Autor[]>([]);
  public  autor$ = this.autorSubject.asObservable();

  private _totalAutores = signal<number>(0);

  public totalAutores = computed(() => this._totalAutores());

  public setTotalItems(total: number): void {
    this._totalAutores.set(total);
  }



listarAutores():Observable<Autor[]>{
  return this.http.get<{content:Autor[]}>(`${this.baseUrl}/autor/listarAutores`)
  .pipe(
    map(response => response.content),
    tap(categorias => this.autorSubject.next(categorias)),
    tap(totalAutores => this.setTotalItems(totalAutores.length)),
    catchError(() => {
      this.autorSubject.next([]);
      return of([]);
    })
  );
}

/**
 * Busca un autor por su ID.
 */
buscarAutor(id: number): Observable<Autor> {
  return this.http.get<Autor>(`${this.baseUrl}/autor/buscar/${id}`);
}

/**
 * Agrega un nuevo autor.
 */
agregarAutor(autor: Partial<Autor>): Observable<Autor> {
  return this.http.post<Autor>(`${this.baseUrl}/autor/agregarAutor`, autor)
  .pipe(
    tap(() => this.listarAutores().subscribe())
  );
}

/**
 * Actualiza un autor existente.
 */
actualizarAutor(id: number, autor: Partial<Autor>): Observable<Autor> {
  return this.http.put<Autor>(`${this.baseUrl}/autor/actualizar/${id}`, autor)
  .pipe(
    tap(() => this.listarAutores().subscribe())
  );;
}

/**
 * Elimina un autor por su ID.
 */
eliminarAutor(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/autor/eliminar/${id}`)
  .pipe(
    map( () => true),
    catchError(() => of(false)),
    tap(() => this.listarAutores().subscribe())
  );
}

}
