import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService} from './autenticacion.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:3000/autenticacion/perfil';

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) {}

  obtenerDatosUsuario(idUsuario: number): Observable<DatosPerfil> {
    const url = `${this.apiUrl}/${idUsuario}`;

   
    const opciones = {
      withCredentials: true
    };

    return this.http.get<DatosPerfil>(url, opciones)
    .pipe(
      catchError(error => {
        if (error.status === 401) {
          
        }
        return throwError(error);
      })
    );
}



editarPerfil(idUsuario: number, datosActualizados: any): Observable<any> {
  const url = `${this.apiUrl}/${idUsuario}`;
  const opciones = { withCredentials: true };

  return this.http.put(url, datosActualizados, opciones).pipe(
    catchError(error => {
      // Manejar cualquier error aquí si es necesario
      throw error;
    })
  );
}

  obtenerPedidosUsuario(idUsuario: number): Observable<any> {
    const url = `http://localhost:3000/pedido/${idUsuario}`;

    const opciones = {
      withCredentials: true
    };

    return this.http.get<any>(url, opciones)
      .pipe(
        catchError(error => {
          
          return throwError(error);
        })
      );
  }
}




export interface DatosPerfil {
  nombre: string;
  apellidos: string;
  correo_electronico: string;
  direccion: string;
  telefonos: Telefono[];

}

interface Telefono {
  numero: string;
}
