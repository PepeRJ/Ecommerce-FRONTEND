### FRONTEND

He utilizado Angular, y para cargar el servidor se hace con el comando “ng serve” en la terminal. Utilizo el puerto 4200.

### BACKEND
He utilizado node.js para el backend y para cargador el servidor se utiliza el comando “node app.js” en la terminal. Utilizo el puerto 3000.

### USUARIO ADMINISTRADOR
Para tener las funcionalidades que tiene el administrador, solo lo hará el usuario que inicie sesión con:  
**Correo: **   peperj7@gmail.com
**Contraseña: ** 1234
Este usuario será el único usuario que podrá crear, editar o eliminar productos desde la pagina de productos.


### BASE DE DATOS 
He utilizado XAMPP, para desplegar el servidor apache en el puerto 80  Y MYSQL en el puerto 3305.
En el .zip del proyecto final, he exportado el archivo sql de la base de datos. Pero aquí dejo el código de las tablas de la base de datos, por si hace falta.
 -- Creación de la tabla Usuario
CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) UNIQUE NOT NULL,
  contrasenya VARCHAR(255) NOT NULL,
  direccion TEXT
);

-- Creación de la tabla Producto
CREATE TABLE Producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  imagen_url VARCHAR(255)
);

-- Creación de la tabla Pedido
CREATE TABLE Pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_carrito INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(50),
  precio_total DECIMAL(10, 2) CHECK (precio_total >= 0),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (id_carrito) REFERENCES Carrito(id) ON DELETE SET NULL
);

-- Creación de la tabla Carrito
CREATE TABLE Carrito (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  cantidad INT NOT NULL CHECK (cantidad >= 0),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id) ON DELETE CASCADE
);

-- Creación de la tabla Telefonos
CREATE TABLE Telefonos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20)
);

-- Creación de la tabla Telefonos_Usuarios
CREATE TABLE Telefonos_Usuarios (
  id_telefonos INT,
  id_usuario INT,
  PRIMARY KEY (id_telefonos, id_usuario),
  FOREIGN KEY (id_telefonos) REFERENCES Telefonos(id),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

-- Creación de la tabla Carrito_Producto
CREATE TABLE Carrito_Productos (
  id_producto INT,
  id_carrito INT,
  cantidad INT NOT NULL CHECK (cantidad >= 0),
  PRIMARY KEY (id_producto, id_carrito),
  FOREIGN KEY (id_producto) REFERENCES Producto(id),
  FOREIGN KEY (id_carrito) REFERENCES Carrito(id)
);
