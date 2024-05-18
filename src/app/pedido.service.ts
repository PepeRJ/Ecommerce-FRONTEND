import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private apiUrl = 'http://localhost:3000/pedido'; 

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    return throwError('Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo.');
  }

  crearPedido(idUsuario: string, idCarrito: string): Observable<any> {
    const body = { id_usuario: idUsuario, id_carrito: idCarrito };
    return this.http.post(`${this.apiUrl}/crear`, body).pipe(catchError(this.handleError));
  }

  obtenerPedido(idPedido: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idPedido}`).pipe(catchError(this.handleError));
  }

  obtenerPedidosUsuario(idUsuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${idUsuario}`).pipe(catchError(this.handleError));
  }

  actualizarPedido(idPedido: string, estado: string): Observable<any> {
    const body = { estado };
    return this.http.put(`${this.apiUrl}/${idPedido}`, body).pipe(catchError(this.handleError));
  }

  eliminarPedido(idPedido: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${idPedido}`).pipe(catchError(this.handleError));
  }
}
