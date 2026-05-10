export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion?: string;
}

export interface Autor {
  id_autor: number;
  nombre_autor: string;
  nacionalidad?: string;
}

export interface Libro {
  id_libro: number;
  isbn: string;
  titulo: string;
  editorial?: string;
  anio_publicacion?: number;
  precio: number;
  stock: number;
  id_categoria: number;
  id_autor: number;
  autor?: Autor;
  categoria?: Categoria;
}

export interface Revista {
  id_revista: number;
  issn: string;
  titulo: string;
  editorial?: string;
  frecuencia?: string;
  precio: number;
  stock: number;
  id_categoria: number;
  categoria?: Categoria;
}

export type Rol = 'USER' | 'ADMIN';

export interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_registro?: string;
  rol?: Rol;
}

export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'En camino' | 'Entregado' | 'Cancelado';

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  fecha_pedido: string;
  estado: string;
  total: number;
  cliente?: Cliente;
  detalles?: DetallePedido[];
}

export type TipoProducto = 'Libro' | 'Revista';

export interface DetallePedido {
  id_detalle: number;
  id_pedido: number;
  tipo_producto: TipoProducto;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  producto?: Libro | Revista;
}

export interface CartItem {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
  cantidad: number;
}
