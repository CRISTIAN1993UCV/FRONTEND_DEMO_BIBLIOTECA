import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutorService } from '../../../services/autor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Autor } from '../../../interfaces/autor.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-new-autor',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-autor.component.html',
  styleUrls: ['./new-autor.component.css']
})
export class NewAutorComponent implements OnInit{
  autorForm!: FormGroup;

  @Input()
  public autor?:Autor | null;



  constructor(
    private fb: FormBuilder,
    private autorService: AutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.autorForm = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }


  onSubmit(): void {
    // Si el formulario no es válido, marcamos todos los controles como touched y mostramos un error
    if (this.autorForm.invalid) {
      this.autorForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Complete el formulario correctamente'
      });
      return; // Cancelamos el envío
    }

    const formData = { ...this.autorForm.value };

    this.autorService.agregarAutor(formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Autor agregado exitosamente'
        });
        // Cerrar el modal programáticamente
        const modalElement = document.getElementById('agregarAutorModal');
        if (modalElement) {
          let modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (!modalInstance) {
            modalInstance = new bootstrap.Modal(modalElement);
          }
          modalInstance.hide();
        }
        this.autorForm.reset();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al agregar autor'
        });
        console.error('Error al agregar autor:', err);
      }
    });
  }
}
