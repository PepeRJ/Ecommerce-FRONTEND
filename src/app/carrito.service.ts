import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


export interface CarritoProducto {
  producto: {
    id: number;
    nombre: string;
    precio: number;
  };
  cantidad: number;
}


export interface Carrito {
  carritoProductos: CarritoProducto[];
  precioTotal: number;
  carritoId: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private apiUrl = 'http://localhost:3000/carrito';


  private carritoSubject: BehaviorSubject<Carrito> = new BehaviorSubject<Carrito>({
    carritoProductos: [],
    precioTotal: 0,
    carritoId: null,
  });

 
  carrito$: Observable<Carrito> = this.carritoSubject.asObservable();


  private carritoModificadoSubject: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);


  carritoModificado$: Observable<void> = this.carritoModificadoSubject.asObservable();

  constructor(private http: HttpClient) {}

  agregarAlCarrito(idUsuario: number, idProducto: number, cantidad: number): Observable<any> {
    const payload = {
      id_usuario: idUsuario,
      id_producto: idProducto,
      cantidad: cantidad,
    };

    return this.http.post<Carrito>(`${this.apiUrl}/add`, payload).pipe(
      tap(() => {
        this.obtenerCarrito(idUsuario).subscribe((carrito) => {
          console.log('Carrito actualizado:', carrito);
          this.carritoSubject.next(carrito);
          this.carritoModificadoSubject.next();
        });
      })
    );
  }

  obtenerCarrito(idUsuario: number): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.apiUrl}/${idUsuario}`).pipe(
      tap((carrito) => {
      
        this.carritoSubject.next(carrito || { carritoProductos: [], precioTotal: 0, carritoId: null });
      })
    );
  }

  modificarCantidad(idUsuario: number, idProducto: number, nuevaCantidad: number): Observable<any> {
    const payload = {
      id_usuario: idUsuario,
      id_producto: idProducto,
      cantidad: nuevaCantidad,
    };

    console.log('Enviando solicitud HTTP para modificar cantidad...', payload);

    return this.http.put<Carrito>(`${this.apiUrl}/modificar-cantidad/${idUsuario}`, payload).pipe(
      tap(() => {
        console.log('Solicitud HTTP para modificar cantidad completada con éxito');
        this.obtenerCarrito(idUsuario).subscribe((carrito) => {
          console.log('Carrito actualizado:', carrito);
          this.carritoSubject.next(carrito);
        });
      })
    );
  }

  realizarCompra(idUsuario: number): Observable<any> {
    if (this.carritoSubject.value.carritoId === null) {
      
      return throwError('ID del carrito no disponible');
    }

    const payload = {
      id_usuario: idUsuario,
      id_carrito: this.carritoSubject.value.carritoId,
    };
    console.log('Realizando solicitud HTTP para realizar la compra...', payload);

    return this.http.post<any>('http://localhost:3000/pedido', payload).pipe(
      tap(() => {
        console.log('Compra realizada con éxito');
       
        this.carritoSubject.next({ carritoProductos: [], precioTotal: 0, carritoId: null });
        this.carritoModificadoSubject.next();
      }),
      catchError((error) => {
        console.error('Error al realizar la compra', error);
        console.log('Cuerpo del error:', error.error); 
        throw error;
      })
    );
  }

  vaciarCarrito(idUsuario: number): Observable<any> {
   
    this.carritoSubject.next({ carritoProductos: [], precioTotal: 0, carritoId: null });

    return this.http.delete(`${this.apiUrl}/vaciar/${idUsuario}`).pipe(
      tap(() => {
        console.log('Carrito vaciado con éxito');
      }),
      catchError((error) => {
        console.error('Error al vaciar el carrito', error);
        throw error;
      })
    );
  }
}


