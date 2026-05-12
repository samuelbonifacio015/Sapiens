import { db } from '../index';
import { pedidos, clientes, detallesPedido } from '../schema';
import { eq, desc } from 'drizzle-orm';
import type { Pedido, Cliente, DetallePedido, EstadoPedido } from '../../types/index.js';

function mapEstado(estado: string | null): EstadoPedido {
  const map: Record<string, EstadoPedido> = {
    'Pendiente':  'pendiente',
    'Confirmado': 'confirmado',
    'En camino':  'enviado',
    'Entregado':  'entregado',
    'Cancelado':  'cancelado',
  };
  return map[estado ?? ''] ?? 'pendiente';
}

function mapCliente(r: typeof clientes.$inferSelect): Cliente {
  return {
    id_cliente: r.ID_Cliente,
    nombre:     r.Nombre_Cliente,
    email:      r.Correo ?? '',
    telefono:   r.Telefono ?? undefined,
    direccion:  r.Direccion ?? undefined,
  };
}

function mapDetalle(r: typeof detallesPedido.$inferSelect): DetallePedido {
  return {
    id_detalle:      r.ID_Detalle,
    id_pedido:       r.ID_Pedido,
    id_libro:        r.Tipo_Producto === 'Libro'   ? r.ID_Producto : undefined,
    id_revista:      r.Tipo_Producto === 'Revista' ? r.ID_Producto : undefined,
    cantidad:        r.Cantidad,
    precio_unitario: Number(r.Precio_Unitario),
  };
}

function mapPedido(
  r: typeof pedidos.$inferSelect,
  cliente: Cliente | null,
  detalles: DetallePedido[],
): Pedido {
  return {
    id_pedido:  r.ID_Pedido,
    id_cliente: r.ID_Cliente,
    fecha:      r.Fecha_Pedido?.toISOString().split('T')[0] ?? '',
    total:      Number(r.Total ?? 0),
    estado:     mapEstado(r.Estado),
    cliente:    cliente ?? undefined,
    detalles,
  };
}

async function enrich(rows: (typeof pedidos.$inferSelect)[]): Promise<Pedido[]> {
  const [allClientes, allDetalles] = await Promise.all([
    db.select().from(clientes),
    db.select().from(detallesPedido),
  ]);
  return rows.map(p => mapPedido(
    p,
    allClientes.find(c => c.ID_Cliente === p.ID_Cliente) ? mapCliente(allClientes.find(c => c.ID_Cliente === p.ID_Cliente)!) : null,
    allDetalles.filter(d => d.ID_Pedido === p.ID_Pedido).map(mapDetalle),
  ));
}

export async function getPedidos(): Promise<Pedido[]> {
  return enrich(await db.select().from(pedidos).orderBy(desc(pedidos.Fecha_Pedido)));
}

export async function getPedidoById(id: number): Promise<Pedido | null> {
  const rows = await db.select().from(pedidos).where(eq(pedidos.ID_Pedido, id));
  if (!rows[0]) return null;
  return (await enrich([rows[0]]))[0];
}

export async function getPedidosByCliente(idCliente: number): Promise<Pedido[]> {
  return enrich(await db.select().from(pedidos).where(eq(pedidos.ID_Cliente, idCliente)));
}

export async function getRecentPedidos(n = 3): Promise<Pedido[]> {
  return enrich(await db.select().from(pedidos).orderBy(desc(pedidos.Fecha_Pedido)).limit(n));
}

export async function getClientes(): Promise<Cliente[]> {
  const rows = await db.select().from(clientes);
  return rows.map(mapCliente);
}
