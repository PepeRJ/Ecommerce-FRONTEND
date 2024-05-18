import { Component, OnInit } from '@angular/core';
import { CarritoService, Carrito } from '../carrito.service';
import { AutenticacionService } from '../autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  idUsuario: number | null = null;
  carritoVacio: boolean = false;
  carrito: Carrito = { carritoProductos: [], precioTotal: 0, carritoId: null };
  mostrarMensajeNoUnidades: boolean = false;

  constructor(
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    
    this.idUsuario = this.autenticacionService.obtenerIdUsuarioAutenticado();
  
  
    this.carritoService.carrito$.subscribe((carrito) => {
      console.log('Carrito modificado. Actualizando...');
      this.carrito = carrito;
  

      this.carritoVacio = this.carrito.carritoProductos.every((producto) => producto.cantidad === 0);
    });
  
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    if (this.idUsuario !== null) {
      this.carritoService.obtenerCarrito(this.idUsuario).subscribe(
        (carrito) => {
       
        },
        (error) => {
          console.error('Error al obtener el carrito', error);
        }
      );
    }
  }

  modificarCantidad(idProducto: number, nuevaCantidad: number): void {
    console.log('Modificando cantidad...', idProducto, nuevaCantidad);
    if (this.idUsuario !== null) {
      if (nuevaCantidad > 0) {
        this.carritoService.modificarCantidad(this.idUsuario, idProducto, nuevaCantidad).subscribe(
          () => {
            console.log('Cantidad modificada con éxito');
          },
          (error) => {
            console.error('Error al modificar la cantidad', error);
  
          
            if (error.error && error.error.error === 'No puedes agregar más productos de los disponibles en el stock') {
              this.mostrarMensajeNoUnidades = true;
  
             
              setTimeout(() => {
                this.mostrarMensajeNoUnidades = false;
              }, 5000);
            }
          }
        );
      } else {
        
        this.carritoService.modificarCantidad(this.idUsuario, idProducto, 0).subscribe(
          () => {
            console.log('Producto eliminado del carrito con éxito');
           
          },
          (error) => {
            console.error('Error al eliminar el producto del carrito', error);
            
          }
        );
      } 
    }
  }

realizarCompra(): void {
  if (this.idUsuario !== null) {
    this.carritoService.realizarCompra(this.idUsuario).subscribe(
      () => {
        console.log('Compra realizada con éxito');

       
        this.vaciarCarrito();
      },
      (error) => {
        console.error('Error al realizar la compra', error);
        console.log('Cuerpo del error:', error.error);
        
      }
    );
  }
}

vaciarCarrito(): void {
  if (this.idUsuario !== null) {
    this.carritoService.vaciarCarrito(this.idUsuario).subscribe(
      () => {
        console.log('Carrito vaciado con éxito');

        
        this.carrito.carritoProductos = [];
        this.carrito.precioTotal = 0;
      },
      (error) => {
        console.error('Error al vaciar el carrito', error);
      }
    );
  }
}}
