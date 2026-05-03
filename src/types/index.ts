export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export interface Autor {
  id_autor: number;
  nombre_autor: string;
  bio?: string;
}

export interface Libro {
  id_libro: number;
  titulo: string;
  isbn: string;
  editorial: string;
  anio_publicacion: number;
  precio: number;
  stock: number;
  id_autor: number;
  id_categoria: number;
  autor?: Autor;
  categoria?: Categoria;
}

export interface Revista {
  id_revista: number;
  titulo: string;
  issn: string;
  editorial: string;
  frecuencia: 'Mensual' | 'Quincenal' | 'Semanal' | 'Bimestral';
  precio: number;
  stock: number;
  id_categoria: number;
  categoria?: Categoria;
}

export interface Cliente {
  id_cliente: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

export type EstadoPedido = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';

export interface Pedido {
  id_pedido: number;
  id_cliente: number;
  fecha: string;
  total: number;
  estado: EstadoPedido;
  cliente?: Cliente;
  detalles?: DetallePedido[];
}

export interface DetallePedido {
  id_detalle: number;
  id_pedido: number;
  id_libro?: number;
  id_revista?: number;
  cantidad: number;
  precio_unitario: number;
  libro?: Libro;
  revista?: Revista;
}

export interface CartItem {
  producto: Libro | Revista;
  tipo: 'libro' | 'revista';
  cantidad: number;
}
