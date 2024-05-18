import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../producto.service';
import { CarritoService } from '../carrito.service';
import { AutenticacionService } from '../autenticacion.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  nuevoProducto: any = {};
  editando: boolean = false;
  productoEditado: any = {};
  mostrarFormularioCrear: boolean = false;
  esUsuarioPermitido: boolean = false;
  mensajeError: string = '';
  mostrarMensajeError: boolean = false;
  errorCreacion: string = '';
  errorEdicion:boolean = false;
  mostrarBotonEliminar: boolean = true;

  constructor(
    private productoService: ProductosService,
    private carritoService: CarritoService,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit() {
    this.productoService.getListaProductos().subscribe(data => {
      
      this.productos = data.map(producto => ({ ...producto, cantidadSeleccionada: 1 }));
    });

    
    const correoUsuario = this.autenticacionService.obtenerCorreoUsuarioAutenticado();

    this.esUsuarioPermitido = correoUsuario === 'peperj7@gmail.com';
  }

  agregarAlCarrito(producto: any): void {
    const idUsuario = this.autenticacionService.obtenerIdUsuarioAutenticado();
  
    if (idUsuario !== null) {
     
      this.mostrarMensajeError = false;
  
     
      if (producto.cantidadSeleccionada > producto.stock) {
        console.warn('Ya no quedan más unidades');
        this.manejarErrorAgregarAlCarrito({ error: { error: 'No puedes agregar más productos de los disponibles en el stock' } }, producto);
        return;
      }
  
      this.carritoService.agregarAlCarrito(idUsuario, producto.id, producto.cantidadSeleccionada).subscribe(
        () => {
          console.log('Producto agregado al carrito con éxito');
       
        },
        (error) => {
          console.error('Error al agregar el producto al carrito', error);
          this.manejarErrorAgregarAlCarrito(error, producto);
        }
      );
    } else {
      console.error('No se pudo obtener el idUsuario autenticado');
   
      this.mostrarMensajeError = true;
  
      
      setTimeout(() => {
        this.mostrarMensajeError = false;
      }, 5000);
    }
  }
  
  manejarErrorAgregarAlCarrito(error: any, producto: any): void {
    console.error('Error al agregar el producto al carrito', error);


    if (error.error && error.error.message === 'Usuario no autenticado') {
      this.mensajeError = 'Tienes que iniciar sesión para añadir productos al carrito.';
      this.limpiarMensajeErrorDespuesDeDelay();
    } else if (error.error && error.error.error === 'No puedes agregar más productos de los disponibles en el stock') {
      this.mensajeError = 'No puedes agregar más productos de los disponibles en el stock.';
 
      producto.mostrarMensajeNoUnidades = true;
  
   
      setTimeout(() => {
        this.mensajeError = '';
        producto.mostrarMensajeNoUnidades = false;
      }, 5000);
    } else {
     
      this.mensajeError = 'Error al agregar el producto al carrito. Inténtelo de nuevo.';
      this.limpiarMensajeErrorDespuesDeDelay();
    }
  }

  private limpiarMensajeErrorDespuesDeDelay(): void {
 
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000);
  }


  editarProducto(): void {
    if (!this.productoEditado.nombre || !this.productoEditado.descripcion || !this.productoEditado.precio || !this.productoEditado.stock || !this.productoEditado.imagen_url) {
 
      this.errorEdicion = true;
  
   
      setTimeout(() => {
        this.errorEdicion = false;
      }, 5000);
  
      return; 
    }
   
    const camposEditados: any = {};
  
    if (this.productoEditado.nombre) {
      camposEditados.nombre = this.productoEditado.nombre;
    }
  
    if (this.productoEditado.descripcion) {
      camposEditados.descripcion = this.productoEditado.descripcion;
    }
  
    if (this.productoEditado.precio) {
      camposEditados.precio = this.productoEditado.precio;
    }
  
    if (this.productoEditado.stock) {
      camposEditados.stock = this.productoEditado.stock;
    }
  
    if (this.productoEditado.imagen_url) {
      camposEditados.imagen_url = this.productoEditado.imagen_url;
    }
  
  
    this.productoService.editProducto(this.productoEditado.id, camposEditados).subscribe(
      () => {
        console.log('Producto editado con éxito');
      
        this.productos = this.productos.map(p => (p.id === this.productoEditado.id ? { ...p, ...camposEditados } : p));
        this.editando = false;
        this.productoEditado = {};
      },
      (error) => {
        console.error('Error al editar el producto', error);
      
      }
    );
    }   
    
    iniciarCreacion(): void {
      this.mostrarFormularioCrear = true;
      this.nuevoProducto = {}; 
    }
    
      UsuarioPermitido(): boolean {
    const correoUsuario = this.autenticacionService.obtenerCorreoUsuarioAutenticado();
    return correoUsuario === 'peperj7@gmail.com';
  }
    cancelarCreacion(): void {
      this.mostrarFormularioCrear = false;
      this.nuevoProducto = {}; 
    }

    iniciarEdicion(producto: any): void {
      this.editando = true;
      this.productoEditado = { ...producto };
    
      this.mostrarBotonEliminar = false;
    }
  
  cancelarEdicion(): void {
    this.editando = false;
    this.productoEditado = {};
  
 
    this.mostrarBotonEliminar = true;
  }

  eliminarProducto(idProducto: number): void {
    this.productoService.deleteProducto(idProducto).subscribe(
      () => {
        console.log('Producto eliminado con éxito');
        

        this.productos = this.productos.filter(p => p.id !== idProducto);
 
      },
      (error) => {
        console.error('Error al eliminar el producto', error);
      }
    );
  }

  crearProducto(): void {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.descripcion || !this.nuevoProducto.precio || !this.nuevoProducto.stock || !this.nuevoProducto.imagen_url) {
      this.errorCreacion = 'Todos los campos son obligatorios';
      console.error(this.errorCreacion);
      setTimeout(() => {
        this.errorCreacion = '';
      }, 5000);
      return;
    }
  
    this.productoService.createProducto(this.nuevoProducto).subscribe(
      (productoCreado) => {
        console.log('Producto creado con éxito', productoCreado);
        

        this.productos.push(productoCreado);
  

      },
      (error) => {
        console.error('Error al crear el producto', error);
      }
    );
  }

  guardarCambios(): void {
    if (this.editando) {
      this.editarProducto();
    } else {
     
      this.productoService.createProducto(this.productoEditado).subscribe(
        (productoCreado) => {
          console.log('Producto creado con éxito', productoCreado);
          this.productoEditado = {}; 
        },
        (error) => {
          console.error('Error al crear el producto', error);
        }
      );
    }
  }
}
