import type {
  Libro, Revista, Autor, Categoria, Cliente, Pedido, DetallePedido, TipoProducto, Rol,
} from '../types/index.js';

type Row = Record<string, any>;

export const mapAutor = (r: Row): Autor => ({
  id_autor: r.ID_Autor,
  nombre_autor: r.Nombre_Autor,
  nacionalidad: r.Nacionalidad ?? undefined,
});

export const mapCategoria = (r: Row): Categoria => ({
  id_categoria: r.ID_Categoria,
  nombre_categoria: r.Nombre_Categoria,
  descripcion: r.Descripcion ?? undefined,
});

export const mapLibro = (r: Row): Libro => ({
  id_libro: r.ID_Libro,
  isbn: r.ISBN,
  titulo: r.Titulo,
  editorial: r.Editorial ?? undefined,
  anio_publicacion: r.Anio_Publicacion ?? undefined,
  precio: Number(r.Precio),
  stock: r.Stock,
  id_categoria: r.ID_Categoria,
  id_autor: r.ID_Autor,
  autor: r.Nombre_Autor != null
    ? { id_autor: r.ID_Autor, nombre_autor: r.Nombre_Autor, nacionalidad: r.Nacionalidad ?? undefined }
    : undefined,
  categoria: r.Nombre_Categoria != null
    ? { id_categoria: r.ID_Categoria, nombre_categoria: r.Nombre_Categoria, descripcion: r.Cat_Descripcion ?? undefined }
    : undefined,
});

export const mapRevista = (r: Row): Revista => ({
  id_revista: r.ID_Revista,
  issn: r.ISSN,
  titulo: r.Titulo,
  editorial: r.Editorial ?? undefined,
  frecuencia: r.Frecuencia ?? undefined,
  precio: Number(r.Precio),
  stock: r.Stock,
  id_categoria: r.ID_Categoria,
  categoria: r.Nombre_Categoria != null
    ? { id_categoria: r.ID_Categoria, nombre_categoria: r.Nombre_Categoria }
    : undefined,
});

export const mapCliente = (r: Row): Cliente => ({
  id_cliente: r.ID_Cliente,
  nombre_cliente: r.Nombre_Cliente,
  correo: r.Correo,
  telefono: r.Telefono ?? undefined,
  direccion: r.Direccion ?? undefined,
  fecha_registro: r.Fecha_Registro != null ? new Date(r.Fecha_Registro).toISOString() : undefined,
  rol: (r.Rol as Rol) ?? undefined,
});

export const mapPedido = (r: Row): Pedido => ({
  id_pedido: r.ID_Pedido,
  id_cliente: r.ID_Cliente,
  fecha_pedido: r.Fecha_Pedido != null ? new Date(r.Fecha_Pedido).toISOString() : '',
  estado: r.Estado,
  total: Number(r.Total ?? 0),
  cliente: r.Nombre_Cliente != null
    ? { id_cliente: r.ID_Cliente, nombre_cliente: r.Nombre_Cliente, correo: r.Correo }
    : undefined,
});

export const mapDetalle = (r: Row): DetallePedido => ({
  id_detalle: r.ID_Detalle,
  id_pedido: r.ID_Pedido,
  tipo_producto: r.Tipo_Producto as TipoProducto,
  id_producto: r.ID_Producto,
  cantidad: r.Cantidad,
  precio_unitario: Number(r.Precio_Unitario),
});
