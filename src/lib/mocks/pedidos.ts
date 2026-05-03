import type { Pedido } from '../../types/index.js';

export const pedidos: Pedido[] = [
  {
    id_pedido: 1001,
    id_cliente: 1,
    fecha: '2025-05-01',
    total: 93.00,
    estado: 'entregado',
    cliente: { id_cliente: 1, nombre: 'Ana Torres', email: 'ana@example.com', telefono: '987654321' },
    detalles: [
      { id_detalle: 1, id_pedido: 1001, id_libro: 1, cantidad: 1, precio_unitario: 45.00 },
      { id_detalle: 2, id_pedido: 1001, id_libro: 5, cantidad: 1, precio_unitario: 48.00 },
    ],
  },
  {
    id_pedido: 1002,
    id_cliente: 2,
    fecha: '2025-05-01',
    total: 52.00,
    estado: 'enviado',
    cliente: { id_cliente: 2, nombre: 'Carlos Mendoza', email: 'carlos@example.com', telefono: '912345678' },
    detalles: [
      { id_detalle: 3, id_pedido: 1002, id_libro: 2, cantidad: 1, precio_unitario: 52.00 },
    ],
  },
  {
    id_pedido: 1003,
    id_cliente: 3,
    fecha: '2025-05-02',
    total: 78.00,
    estado: 'pendiente',
    cliente: { id_cliente: 3, nombre: 'Lucía Ramírez', email: 'lucia@example.com' },
    detalles: [
      { id_detalle: 4, id_pedido: 1003, id_libro: 7, cantidad: 1, precio_unitario: 55.00 },
      { id_detalle: 5, id_pedido: 1003, id_revista: 1, cantidad: 2, precio_unitario: 18.00 },
      { id_detalle: 6, id_pedido: 1003, id_revista: 4, cantidad: 1, precio_unitario: 15.00 },
    ],
  },
  {
    id_pedido: 1004,
    id_cliente: 4,
    fecha: '2025-05-02',
    total: 110.00,
    estado: 'confirmado',
    cliente: { id_cliente: 4, nombre: 'Pedro Silva', email: 'pedro@example.com', telefono: '956789012' },
    detalles: [
      { id_detalle: 7, id_pedido: 1004, id_libro: 8, cantidad: 1, precio_unitario: 89.00 },
      { id_detalle: 8, id_pedido: 1004, id_revista: 2, cantidad: 1, precio_unitario: 22.00 },
    ],
  },
  {
    id_pedido: 1005,
    id_cliente: 5,
    fecha: '2025-05-02',
    total: 38.00,
    estado: 'cancelado',
    cliente: { id_cliente: 5, nombre: 'María Huanca', email: 'maria@example.com' },
    detalles: [
      { id_detalle: 9, id_pedido: 1005, id_libro: 4, cantidad: 1, precio_unitario: 38.00 },
    ],
  },
];
