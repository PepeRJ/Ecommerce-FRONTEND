import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';


export interface CredencialesInicioSesion {
  username: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  contrasenya: string;
  direccion: string;
}

export interface DatosRegistro {
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  direccion: string;
  contrasenya: string;
  numero: number[];
}


export interface RespuestaInicioSesion {
  message: string;
  usuario: Usuario;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private apiUrl = 'http://localhost:3000/autenticacion';
  private token: string = '';
  private usuarioAutenticado: Usuario | null = null;
  estaAutenticadoObservable: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  registro(usuario: DatosRegistro): Observable<any> {
    console.log('Datos del usuario en el servicio:', usuario);
    return this.http.post(`${this.apiUrl}/registro`, usuario).pipe(
      tap((response: any) => {

        this.actualizarDatosAutenticacion(response.usuario);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la solicitud:', error);
        let errorMessage = 'Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.';
  
        if (error.error && error.error.error) {
          errorMessage = error.error.error; //
        }
  
        return throwError(errorMessage);
      })
    );
  }
  
  


  iniciarSesion(credenciales: CredencialesInicioSesion): Observable<RespuestaInicioSesion> {
    return this.http.post<RespuestaInicioSesion>(`${this.apiUrl}/inicio-sesion`, credenciales).pipe(
      tap((data) => {
        this.actualizarDatosAutenticacion(data.usuario);
        
      }),
      catchError(this.handleError)
    );
  }

  obtenerCorreoUsuarioAutenticado(): string | null {
    return this.usuarioAutenticado ? this.usuarioAutenticado.correo_electronico : null;
  }

  cerrarSesion(): Observable<any> {
  
    this.usuarioAutenticado = null;
    this.estaAutenticadoObservable.next(false);

  
    const cerrarSesionUrl = `${this.apiUrl}/cerrar-sesion`;

    this.cookieService.delete('connect.sid', '/');
    this.cookieService.delete('sesion_usuario', '/');

  
    return this.http.post(cerrarSesionUrl, {}).pipe(
      catchError(this.handleError)
    );
  }


  estaAutenticado(): boolean {
    return !!this.cookieService.get('sesion_usuario');
  }

  obtenerIdUsuarioAutenticado(): number | null {
    return this.usuarioAutenticado ? this.usuarioAutenticado.id : null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la solicitud:', error);

    let errorMessage = 'Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.';

    if (error.error instanceof ErrorEvent) {
      console.error('Error del lado del cliente:', error.error.message);
      errorMessage = 'Error del lado del cliente. Por favor, inténtalo de nuevo.';
    } else {
      console.error('Error del lado del servidor:', error.status, error.error);
      errorMessage = `Error del lado del servidor (estado ${error.status}): ${error.error.message}`;
    }

    return throwError(errorMessage);
  }

  private actualizarDatosAutenticacion(usuario: Usuario): void {
    this.usuarioAutenticado = usuario;
    this.estaAutenticadoObservable.next(true); 
    console.log('Observable de autenticación emitido:', true);
  }
}



