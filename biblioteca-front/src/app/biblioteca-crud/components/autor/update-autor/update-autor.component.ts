import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Autor } from '../../../interfaces/autor.interface';
import { AutorService } from '../../../services/autor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-update-autor',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-autor.component.html',
  styleUrl: './update-autor.component.css'
})
export class UpdateAutorComponent implements OnChanges{

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
      idAutor: [0,Validators.required],
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['autor'] && changes['autor'].currentValue){
      const autor = changes['autor'].currentValue as Autor;
      if(autor){
        this.autorForm.reset(autor);
      }
    }
  }
  get atuorActualesForm():Autor{
    const autor = this.autorForm.value as Autor;
    return autor;
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

    this.autorService.actualizarAutor(this.atuorActualesForm.idAutor,formData).subscribe({
      next: (data) => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Autor actualizar exitosamente'
        });
        // Cerrar el modal programáticamente
        const modalElement = document.getElementById('actualizarAutorModal');
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
          text: 'Error al actualizar autor'
        });
        console.error('Error al actualizar autor:', err);
      }
    });
  }
}
