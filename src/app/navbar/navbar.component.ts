import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../autenticacion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  estaAutenticado: boolean = false;
  idUsuario: number | null = null;

  constructor(public autenticacionService: AutenticacionService) {}



ngOnInit(): void {
 
  this.autenticacionService.estaAutenticadoObservable.subscribe(
    (autenticado: boolean) => {
      this.estaAutenticado = autenticado;

      if (autenticado) {
       
        const idUsuario = this.autenticacionService.obtenerIdUsuarioAutenticado();
        this.idUsuario = idUsuario !== null ? idUsuario : null;
      } else {
        this.idUsuario = null;
      }
    }
  );
}

  
  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.autenticacionService.cerrarSesion().subscribe(() => {
      console.log('Sesión cerrada correctamente.');
      
    });
  }}