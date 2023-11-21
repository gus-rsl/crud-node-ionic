import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  usuarioForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.usuarioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      edad: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.route.params.subscribe(params => {
      const email = params['email'];
      if (email) {
        // Realiza las operaciones necesarias con el email
        this.cargarDatosUsuario(email);
      }
    });
  }

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

  actualizarUsuario() {
    const email = this.usuarioForm.value.email;
    const datosActualizados = this.usuarioForm.value;

    this.dataService.actualizarUsuario(email, datosActualizados).subscribe(
      (response) => {
        console.log(response.mensaje); // Muestra el mensaje del servidor en la consola
        // Puedes redirigir a la página de usuarios después de la actualización
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error('Error al actualizar usuario', error);
        this.router.navigate(['/usuarios']);
      }
    );
  }

}
