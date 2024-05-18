import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilService, DatosPerfil } from '../perfil.service';
import { AutenticacionService } from '../autenticacion.service';
import { DatosRegistro } from '../autenticacion.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  idUsuario: number | null = null;
  datosPerfil: DatosPerfil = {
    nombre: '',
    apellidos: '',
    correo_electronico: '',
    direccion: '',
    telefonos: []
  };
  historialPedidos: any[] = [];


  nuevosDatos: Partial<DatosRegistro> = {
    contrasenya: '',
    direccion: '',
    numero: []
  };

  nuevoTelefono: number | null = null;


  editandoContrasenya = false;
  editandoDireccion = false;
  editandoTelefono = false;
  telefonos: number[] = [];
  telefono: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private perfilService: PerfilService,
    private changeDetectorRef: ChangeDetectorRef,
    public autenticacionService: AutenticacionService
  ) {}

  habilitarEdicion(campo: string) {

    if (campo === 'contrasenya') {
      this.editandoContrasenya = true;
    } else if (campo === 'direccion') {
      this.editandoDireccion = true;
    } else if (campo === 'telefonos') {
      this.editandoTelefono = true;
    }
    
  }

  guardarEdicion(campo: string) {
   
    if (campo === 'contrasenya') {
      this.editandoContrasenya = false;
    } else if (campo === 'direccion') {
      this.editandoDireccion = false;
    } else if (campo === 'telefonos') {
      this.editandoTelefono = false;
    }


    this.editarPerfil();
  }

  cancelarEdicion() {

    this.editandoContrasenya = false;
    this.editandoDireccion = false;
    this.editandoTelefono = false;
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

  trackByIndex(index: number, item: any): number {
    return index;
  }

  


  ngOnInit() {
    console.log('ngOnInit en PerfilComponent');
    const idUsuarioString = this.route.snapshot.paramMap.get('id');

    if (idUsuarioString !== null) {
      this.idUsuario = +idUsuarioString; 

      if (!isNaN(this.idUsuario)) {
  
        this.obtenerDatosUsuario(this.idUsuario);
      } else {
        console.log('ID de usuario no válido. No se pueden obtener datos del perfil.');
      }
    } else {
      console.log('No se proporcionó un ID de usuario en la ruta. No se pueden obtener datos del perfil.');
    }
  }

  obtenerDatosUsuario(idUsuario: number) {
    console.log('Intentando obtener datos del perfil y historial de pedidos');
    this.perfilService.obtenerDatosUsuario(idUsuario).subscribe(
      (response: DatosPerfil) => {
        console.log('Datos del perfil después de la edición:', response);
        this.datosPerfil = response;

   
        this.nuevosDatos = { ...response };


        this.perfilService.obtenerPedidosUsuario(idUsuario).subscribe(
          (pedidos: any[]) => {
            console.log('Historial de pedidos:', pedidos);
            this.historialPedidos = pedidos;


            this.changeDetectorRef.detectChanges();
            console.log('Después de obtener datos del perfil y historial de pedidos');
          },
          (error) => {
            console.error('Error al obtener historial de pedidos', error);

          }
        );
      },
      (error) => {
        console.error('Error al obtener datos del perfil', error);

        if (error.status === 401) {
          console.log('Usuario no autenticado. Redirigir a la página de inicio de sesión');
          this.router.navigate(['']);
        } else {
          console.log('Otro tipo de error. Puedes manejarlo aquí.');
          console.log('Error completo:', error); 
      
        }
      }
    );
  }

  editarPerfil() {
    
    if (this.idUsuario === null || isNaN(this.idUsuario)) {
      console.error('ID de usuario no válido. No se puede editar el perfil.');
      return;
    }
  
    const idUsuario = this.idUsuario;
    const datosActualizados = {
      contrasenya: this.nuevosDatos.contrasenya,
      direccion: this.nuevosDatos.direccion,
      numero: this.telefonos 
    };
  
    this.perfilService.editarPerfil(idUsuario, datosActualizados).subscribe(
      (response) => {
        console.log('Perfil actualizado exitosamente', response);
        
        this.obtenerDatosUsuario(idUsuario);
      },
      (error) => {
        console.error('Error al actualizar el perfil', error);
        
      }
    );
  }
}