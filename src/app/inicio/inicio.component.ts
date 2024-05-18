import { Component } from '@angular/core';
import { AutenticacionService, RespuestaInicioSesion, DatosRegistro } from '../autenticacion.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  username: string = '';
  password: string = '';
  nombre: string = '';
  apellidos: string = '';
  emailRegistro: string = '';
  passwordRegistro: string = '';
  direccion: string = '';
  telefonos: number[] = [];
  errorMessage: string = '';
  errorInicioSesion: string = ''; 
  errorRegistro: string = '';
  telefono: number | null = null;

  mostrarCamposTelefonos: boolean = false;
  mostrarLogin: boolean = false;
  mostrarRegistro: boolean = false;
  mostrarCerrar: boolean = false;

  constructor(private autenticacionService: AutenticacionService, private router: Router) {} 

  registro() {
    console.log('Nombre:', this.nombre);
    console.log('Apellidos:', this.apellidos);
    console.log('Correo Electrónico:', this.emailRegistro);
    console.log('Contraseña:', this.passwordRegistro);
    console.log('Dirección:', this.direccion);
    console.log('Teléfonos:', this.telefonos);
  
    
    if (!this.nombre || !this.apellidos || !this.emailRegistro || !this.passwordRegistro || !this.direccion || this.telefonos.length === 0) {
      this.errorRegistro = 'Todos los campos son obligatorios';
      console.error(this.errorRegistro);
      setTimeout(() => {
        this.errorRegistro = '';
      }, 5000);
      return;
    }

    const telefonosNumeros = this.telefonos.map(telefono => +telefono);

    const nuevoUsuario: DatosRegistro = {
      nombre: this.nombre,
      apellidos: this.apellidos,
      correo_electronico: this.emailRegistro,
      direccion: this.direccion,
      contrasenya: this.passwordRegistro,
      numero: telefonosNumeros
    };

    this.autenticacionService.registro(nuevoUsuario).subscribe(
      (response) => {
        console.log('Registro exitoso', response);
        this.router.navigate(['/perfil', response.usuario.id]);
        this.errorRegistro = '';  
        this.limpiarCampos();
      },
      (error: any) => {
        this.manejarErrorRegistro(error);
      }
    );
  }

  manejarErrorRegistro(error: any) {
    console.error('Error de registro', error);
      
    if (error.error && error.error.error === 'El usuario ya existe') {
      this.errorRegistro = 'Este correo electrónico ya está registrado.';
    } else {
     
      this.errorRegistro = (error.error && error.error.message) ? error.error.message : 'Este correo electrónico ya está registrado.';
    }
  
    
    setTimeout(() => {
      this.errorRegistro = '';
    }, 5000);
  }
  
  inicioSesion() {
    const credenciales = { username: this.username, password: this.password };
    this.autenticacionService.iniciarSesion(credenciales).subscribe(
      (response: RespuestaInicioSesion) => {
        console.log('Inicio de sesión exitoso', response);
        this.router.navigate(['/perfil', response.usuario.id]);
        console.log('Navegación al perfil realizada.');
        this.limpiarCampos();
      },
      (error) => {
        console.error('Error de inicio de sesión', error);
        this.errorInicioSesion = 'Error al iniciar sesión, inténtelo de nuevo.'; 
  
        if (error instanceof HttpErrorResponse) {
          console.error('Estado:', error.status);
          console.error('Cuerpo:', error.error);
        }
  
        
        setTimeout(() => {
          this.errorInicioSesion = '';
        }, 5000);
      }
    );
  }
  

  cerrarSesion() {
    this.autenticacionService.cerrarSesion().subscribe(
      () => {
        console.log('Cierre de sesión exitoso');
        this.cerrarFormularios();
    
        this.router.navigate(['/']);
      },
      (error: any) => {
       
        console.error('Error de cierre de sesión', error);
      }
    );
  }

  limpiarCampos() {
   
    this.username = '';
    this.password = '';
    this.nombre = '';
    this.apellidos = '';
    this.emailRegistro = '';
    this.passwordRegistro = '';
    this.direccion = '';
    this.telefonos = [];
    this.errorMessage = '';
    this.errorInicioSesion = '';
    this.errorRegistro = '';
  }

  autoAgregarTelefono() {
    
    if (this.telefonos.length === 0 && this.telefono !== null && this.telefono !== 0) {
        
        this.telefonos.push(this.telefono);
    }
}


agregarTelefono() {
  
  if (this.telefono !== null && this.telefono !== 0 && this.telefonos.indexOf(this.telefono) === -1) {
      
      this.telefonos.push(this.telefono);
  }
  
  this.telefono = null;
}


  eliminarTelefono(index: number) {
  
    this.telefonos.splice(index, 1);
  }

  mostrarLoginForm() {
    this.mostrarLogin = true;
    this.mostrarRegistro = false;
    this.mostrarCerrar = true;
  }

  mostrarRegistroForm() {
    this.mostrarRegistro = true;
    this.mostrarLogin = false;
    this.mostrarCerrar = true;
  }

  cerrarFormularios() {
    this.mostrarLogin = false;
    this.mostrarRegistro = false;
    this.mostrarCerrar = false;
  }
 
  trackByIndex(index: number, item: any): number {
    return index;
  }
}

