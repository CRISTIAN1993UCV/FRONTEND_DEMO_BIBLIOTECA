import { Autor } from "./autor.interface";


export interface Libros {
  idLibro:          number;
  titulo:           string;
  autor:            Autor;
  isbn:             string;
  fechaPublicacion: Date;
  estado:           string;
}

