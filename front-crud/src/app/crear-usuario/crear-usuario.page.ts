import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.page.html',
  styleUrls: ['./crear-usuario.page.scss'],
})
export class CrearUsuarioPage implements OnInit {
  usuarioForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router) {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      edad: [null, [Validators.required, Validators.min(0)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  cargarDatosUsuario(email: string) {
    // Lógica para cargar los datos del usuario utilizando el servicio DataService
    // y llenar el formulario
    this.dataService.getUsuarioPorEmail(email).subscribe(
      (usuario) => {
        this.usuarioForm.patchValue(usuario); // Llena el formulario con los datos del usuario
      },
      (error) => {
        console.error('Error al cargar datos del usuario', error);
      }
    );
  }

  crearUsuario() {
    if (this.usuarioForm.valid) {
      const nuevoUsuario = this.usuarioForm.value;

      this.dataService.crearUsuario(nuevoUsuario).subscribe(
        (response) => {
          console.log('Usuario creado exitosamente', response);
          this.router.navigate(['/usuarios']);
        },
        (error) => {
          console.error('Error al crear usuario', error);
          this.router.navigate(['/usuarios']);

        }
      );
    }
  }

}
