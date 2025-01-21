import { Libros } from "./libro.interface";

export interface Prestamos {
  idPrestamo:      number;
  libro:           Libros;
  fechaPrestamo:   Date;
  fechaDevolucion: Date;
  estado:          string;
}

