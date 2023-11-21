import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios!: any[];

  constructor(
    private dataService: DataService,
    private router: Router

    ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.dataService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
    });
  }

  // En la función editarUsuario en usuarios.page.ts
editarUsuario(usuario: any) {
  // Asegúrate de que usuario esté definido antes de acceder a su propiedad email
  if (usuario && usuario.email) {
    this.router.navigate(['/editar-usuario', { email: usuario.email }]);
  } else {
    console.error('El objeto de usuario es nulo o no tiene la propiedad email.');
  }
}
  eliminarUsuario(email: string) {
    if (email) {
      this.dataService.eliminarUsuario(email).subscribe(
        (response) => {
          console.log(`Usuario con email ${email} eliminado con éxito`, response);
          // Recargar la lista de usuarios después de la eliminación
          this.cargarUsuarios();
        },
        (error) => {
          console.error('Error al eliminar usuario', error);
          this.cargarUsuarios();
        }
      );
    } else {
      console.error('Email de usuario indefinido. No se puede realizar la eliminación.');
      this.cargarUsuarios();
    }
  }

  irACrearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }
}
