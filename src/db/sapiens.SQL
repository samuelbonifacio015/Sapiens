
-- Crear la base de datos
CREATE DATABASE Sapiens_DB;

-- Usar la base de datos
USE Sapiens_DB;

-- Tabla de Categorías
CREATE TABLE Categorias (
    ID_Categoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Categoria VARCHAR(255) NOT NULL,
    Descripcion TEXT
);

-- Tabla de Autores
CREATE TABLE Autores (
    ID_Autor INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Autor VARCHAR(255) NOT NULL,
    Nacionalidad VARCHAR(100)
);

-- Tabla de Libros
CREATE TABLE Libros (
    ID_Libro INT AUTO_INCREMENT PRIMARY KEY,
    ISBN VARCHAR(20) UNIQUE NOT NULL,
    Titulo VARCHAR(500) NOT NULL,
    Editorial VARCHAR(255),
    Anio_Publicacion INT,
    Precio DECIMAL(10, 2) NOT NULL,
    Stock INT DEFAULT 0,
    ID_Categoria INT,
    ID_Autor INT,
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria),
    FOREIGN KEY (ID_Autor) REFERENCES Autores(ID_Autor)
);

-- Tabla de Revistas
CREATE TABLE Revistas (
    ID_Revista INT AUTO_INCREMENT PRIMARY KEY,
    ISSN VARCHAR(20) UNIQUE NOT NULL,
    Titulo VARCHAR(500) NOT NULL,
    Editorial VARCHAR(255),
    Frecuencia VARCHAR(50),
    Precio DECIMAL(10, 2) NOT NULL,
    Stock INT DEFAULT 0,
    ID_Categoria INT,
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

-- Tabla de Clientes
CREATE TABLE Clientes (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_Cliente VARCHAR(255) NOT NULL,
    Correo VARCHAR(255) UNIQUE,
    Telefono VARCHAR(20),
    Direccion VARCHAR(500),
    Fecha_Registro DATETIME DEFAULT NOW()
);

-- Tabla de Pedidos
CREATE TABLE Pedidos (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cliente INT NOT NULL,
    Fecha_Pedido DATETIME DEFAULT NOW(),
    Estado VARCHAR(50) DEFAULT 'Pendiente',
    Total DECIMAL(10, 2),
    FOREIGN KEY (ID_Cliente) REFERENCES Clientes(ID_Cliente)
);

-- Tabla de Detalles de Pedido
CREATE TABLE Detalles_Pedido (
    ID_Detalle INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT NOT NULL,
    Tipo_Producto ENUM('Libro', 'Revista') NOT NULL,
    ID_Producto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_Unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (ID_Pedido) REFERENCES Pedidos(ID_Pedido)
);

-- Inserción de datos de prueba

INSERT INTO Categorias (Nombre_Categoria, Descripcion) VALUES
('Literatura Peruana', 'Obras de autores peruanos de todos los géneros literarios.'),
('Literatura Internacional', 'Obras de autores internacionales traducidas al español.'),
('Ciencias y Tecnología', 'Libros sobre ciencias exactas, ingeniería y tecnología.'),
('Revistas de Actualidad', 'Publicaciones periódicas sobre noticias y cultura general.'),
('Infantil y Juvenil', 'Libros y materiales de lectura para niños y jóvenes.');

INSERT INTO Autores (Nombre_Autor, Nacionalidad) VALUES
('Mario Vargas Llosa', 'Peruana'),
('Julio Ramón Ribeyro', 'Peruana'),
('Gabriel García Márquez', 'Colombiana'),
('Isabel Allende', 'Chilena'),
('Yuval Noah Harari', 'Israelí');

INSERT INTO Libros (ISBN, Titulo, Editorial, Anio_Publicacion, Precio, Stock, ID_Categoria, ID_Autor) VALUES
('978-9972-670-00-1', 'La ciudad y los perros', 'Punto de Lectura', 2010, 45.00, 120, 1, 1),
('978-9972-670-01-2', 'La tentación del fracaso', 'Seix Barral', 2015, 52.00, 85, 1, 2),
('978-9504-916-03-3', 'Cien años de soledad', 'Sudamericana', 2018, 55.00, 200, 2, 3),
('978-9504-933-04-4', 'La casa de los espíritus', 'Sudamericana', 2017, 49.00, 150, 2, 4),
('978-0-06-231609-5', 'Sapiens: De animales a dioses', 'Debate', 2016, 65.00, 300, 3, 5);

INSERT INTO Revistas (ISSN, Titulo, Editorial, Frecuencia, Precio, Stock, ID_Categoria) VALUES
('0001-0782', 'National Geographic en Español', 'National Geographic Partners', 'Mensual', 25.00, 80, 4),
('0028-0836', 'Caretas', 'Empresa Editora Caretas', 'Quincenal', 12.00, 150, 4),
('1460-4582', 'Billiken', 'Editorial Atlántida', 'Quincenal', 10.00, 200, 5);

INSERT INTO Clientes (Nombre_Cliente, Correo, Telefono, Direccion) VALUES
('Andrea Solis', 'andrea.solis@email.com', '987123456', 'Av. Larco 345, Miraflores, Lima'),
('Roberto Chávez', 'roberto.chavez@email.com', '956789012', 'Calle Las Begonias 250, San Isidro, Lima'),
('Lucía Fernández', 'lucia.fernandez@email.com', '912345678', 'Av. Javier Prado 3800, San Borja, Lima');

INSERT INTO Pedidos (ID_Cliente, Fecha_Pedido, Estado, Total) VALUES
(1, '2026-04-01 10:30:00', 'Entregado', 97.00),
(2, '2026-04-05 15:00:00', 'En camino', 55.00),
(3, '2026-04-10 09:15:00', 'Pendiente', 147.00);

INSERT INTO Detalles_Pedido (ID_Pedido, Tipo_Producto, ID_Producto, Cantidad, Precio_Unitario) VALUES
(1, 'Libro', 1, 1, 45.00),
(1, 'Revista', 1, 1, 25.00),
(1, 'Revista', 2, 1, 12.00),
(2, 'Libro', 3, 1, 55.00),
(3, 'Libro', 4, 1, 49.00),
(3, 'Libro', 5, 1, 65.00),
(3, 'Revista', 2, 1, 12.00);

-- Nuevos autores peruanos
INSERT INTO Autores (Nombre_Autor, Nacionalidad) VALUES
('Jeremías Gamboa', 'Peruana'),
('Diego Trelles Paz', 'Peruana'),
('Óscar Malca', 'Peruana'),
('César Calvo', 'Peruana'),
('Lucía Charún-Illescas', 'Peruana'),
('Enrique López Albújar', 'Peruana'),
('Óscar Colchado Lucio', 'Peruana'),
('César Vallejo', 'Peruana');

-- Nuevos libros
INSERT INTO Libros (ISBN, Titulo, Editorial, Anio_Publicacion, Precio, Stock, ID_Categoria, ID_Autor) VALUES
('978-612-4115-01-1', 'Contarlo todo', 'Planeta', 2013, 42.00, 60, 1, 6),
('978-612-4115-02-2', 'Bioy', 'Peisa', 2012, 38.00, 45, 1, 7),
('978-612-4115-03-3', 'Al final de la calle', 'El Santo Oficio', 2003, 35.00, 40, 1, 8),
('978-612-4115-04-4', 'Las tres mitades de Ino Moxo', 'Proceso', 1981, 48.00, 30, 1, 9),
('978-612-4115-05-5', 'Malambo', 'San Marcos', 2001, 40.00, 35, 1, 10),
('978-612-4115-06-6', 'Matalaché', 'Peisa', 2005, 32.00, 50, 1, 11),
('978-612-4115-07-7', 'Cholito en los Andes mágicos', 'San Marcos', 1999, 28.00, 90, 5, 12),
('978-612-4115-08-8', 'Paco Yunque', 'Santillana', 2010, 22.00, 120, 1, 13),
('978-612-4115-09-9', 'Trilce', 'Cátedra', 2014, 35.00, 55, 1, 13);

-- Ejemplo de modificación de datos (UPDATE)
UPDATE Libros SET Stock = Stock - 1 WHERE ID_Libro = 1;
UPDATE Pedidos SET Estado = 'Confirmado' WHERE ID_Pedido = 3;

-- Verificación
SHOW DATABASES;
SHOW TABLES;
SELECT * FROM Libros;
SELECT * FROM Pedidos;
SELECT * FROM Clientes;
